"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function FileUploadTest() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadResult, setUploadResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      })
      return
    }
    
    setIsLoading(true)
    setUploadResult('')
    
    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', selectedFile)
      
      // Log the request
      console.log('Making direct upload request to http://localhost:8080/public/upload')
      
      // Send the request
      const response = await fetch('http://localhost:8080/public/upload', {
        method: 'POST',
        body: formData,
      })
      
      // Log response status
      console.log('Response status:', response.status, response.statusText)
      console.log('Response headers:', Object.fromEntries([...response.headers]))
      
      // Handle response
      if (response.ok) {
        let responseText
        const contentType = response.headers.get('content-type')
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const jsonData = await response.json()
            responseText = JSON.stringify(jsonData, null, 2)
            toast({
              title: "Upload successful",
              description: `File uploaded successfully: ${jsonData.filename}`
            })
          } catch (error) {
            responseText = 'Error parsing JSON: ' + error
            console.error('Error parsing JSON:', error)
          }
        } else {
          responseText = await response.text()
          toast({
            title: "Upload response received",
            description: "Response was not JSON format"
          })
        }
        
        setUploadResult(responseText)
      } else {
        let errorText
        try {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json()
            errorText = JSON.stringify(errorData, null, 2)
          } else {
            errorText = await response.text()
          }
        } catch (e) {
          errorText = `Error ${response.status}: ${response.statusText}`
        }
        
        setUploadResult(`Error: ${errorText}`)
        toast({
          title: "Upload failed",
          description: `Server returned status ${response.status}`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadResult(`Upload error: ${error instanceof Error ? error.message : String(error)}`)
      toast({
        title: "Upload error",
        description: String(error instanceof Error ? error.message : error),
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>File Upload Test</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Select File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2"
              />
              {selectedFile && (
                <p className="text-sm mt-1">Selected: {selectedFile.name}</p>
              )}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload File"}
            </Button>
          </form>
          
          {uploadResult && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-1">Upload Result:</h3>
              <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-auto max-h-60">
                {uploadResult}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
