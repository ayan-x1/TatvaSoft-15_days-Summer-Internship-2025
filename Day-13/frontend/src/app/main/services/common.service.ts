import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable, throwError } from "rxjs"
import { catchError, map } from "rxjs/operators"
import { environment } from "../../../environments/environment"

import { API_ENDPOINTS } from "../constants/api.constants"
import { City, Country, Mission } from "../interfaces/common.interface"

@Injectable({
  providedIn: "root",
})
export class CommonService {
  constructor(private http: HttpClient) {}
  apiUrl = `${environment.apiBaseUrl}/api`
  imageUrl = environment.apiBaseUrl
  searchList: BehaviorSubject<any> = new BehaviorSubject<any>("")

  getMissionCountryList() {
    return this.http.get(`${this.apiUrl}${API_ENDPOINTS.COMMON.MISSION_COUNTRY_LIST}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  getMissionCityList() {
    return this.http.get(`${this.apiUrl}${API_ENDPOINTS.COMMON.MISSION_CITY_LIST}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  getMissionThemeList() {
    return this.http.get(`${this.apiUrl}${API_ENDPOINTS.COMMON.MISSION_THEME_LIST}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  getMissionSkillList() {
    return this.http.get(`${this.apiUrl}${API_ENDPOINTS.COMMON.MISSION_SKILL_LIST}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  /**
   * FIXED: Upload Image method with proper multipart/form-data handling
   * @param formData - FormData object containing files and other data
   * @returns Observable with upload response
   */
  uploadImage(formData: FormData): Observable<any> {
    // CRITICAL: Do NOT set Content-Type header manually
    // Angular HttpClient will automatically set multipart/form-data with proper boundary
    const headers = new HttpHeaders()
    // Explicitly remove Content-Type if it exists
    headers.delete('Content-Type')

    return this.http.post(`${this.apiUrl}${API_ENDPOINTS.COMMON.UPLOAD_IMAGE}`, formData, {
      headers: headers,
      reportProgress: true,
      observe: 'response'
    }).pipe(
      map((response: any) => response.body), // Extract response body
      catchError(this.handleUploadError)
    )
  }

  /**
   * Alternative upload method with progress tracking
   * @param formData - FormData object
   * @returns Observable with progress and response
   */
  uploadImageWithProgress(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}${API_ENDPOINTS.COMMON.UPLOAD_IMAGE}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.handleUploadError)
    )
  }

  /**
   * Upload image with authentication token
   * @param formData - FormData object
   * @param token - Authorization token
   * @returns Observable with upload response
   */
  uploadImageWithAuth(formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Still don't set Content-Type for multipart/form-data
    })

    return this.http.post(`${this.apiUrl}${API_ENDPOINTS.COMMON.UPLOAD_IMAGE}`, formData, {
      headers: headers,
      reportProgress: true,
      observe: 'response'
    }).pipe(
      map((response: any) => response.body),
      catchError(this.handleUploadError)
    )
  }

  /**
   * Upload single image with validation
   * @param file - Single file to upload
   * @param moduleName - Module name for categorization
   * @returns Observable with upload response
   */
  uploadSingleImage(file: File, moduleName: string = 'Mission'): Observable<any> {
    // Validate file before upload
    const validationError = this.validateImageFile(file)
    if (validationError) {
      return throwError(() => new Error(validationError))
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('moduleName', moduleName)

    return this.uploadImage(formData)
  }

  /**
   * Upload multiple images with validation
   * @param files - Array of files to upload
   * @param moduleName - Module name for categorization
   * @returns Observable with upload response
   */
  uploadMultipleImages(files: File[], moduleName: string = 'Mission'): Observable<any> {
    // Validate all files first
    for (const file of files) {
      const validationError = this.validateImageFile(file)
      if (validationError) {
        return throwError(() => new Error(`${file.name}: ${validationError}`))
      }
    }

    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file) // Use 'files' for multiple files
    })
    formData.append('moduleName', moduleName)

    return this.uploadImage(formData)
  }

  /**
   * Validate image file
   * @param file - File to validate
   * @returns Error message or null if valid
   */
  private validateImageFile(file: File): string | null {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB
    const minSize = 1024 // 1KB

    if (!file) {
      return 'No file selected'
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'
    }

    if (file.size > maxSize) {
      return `File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
    }

    if (file.size < minSize) {
      return 'File size too small. Minimum size is 1KB'
    }

    return null
  }

  countryList(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}${API_ENDPOINTS.COMMON.COUNTRY_LIST}`)
      .pipe(
        catchError(this.handleError)
      )
  }
  
  cityList(countryId: any): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}${API_ENDPOINTS.COMMON.CITY_LIST}/${countryId}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  contactUs(data: any) {
    return this.http.post(`${this.apiUrl}${API_ENDPOINTS.COMMON.CONTACT_US}`, data)
      .pipe(
        catchError(this.handleError)
      )
  }

  //Volunteering TimeSheet Hours
  getMissionTitle(): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.apiUrl}${API_ENDPOINTS.COMMON.MISSION_TITLE_LIST}`)
      .pipe(
        catchError(this.handleError)
      )
  }
  
  //Add Skill
  addUserSkill(data: any) {
    return this.http.post(`${this.apiUrl}${API_ENDPOINTS.COMMON.ADD_USER_SKILL}`, data)
      .pipe(
        catchError(this.handleError)
      )
  }

  getUserSkill(userId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${API_ENDPOINTS.COMMON.GET_USER_SKILL}/${userId}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  /**
   * Generic error handler for HTTP requests
   * @param error - HTTP error response
   * @returns Observable error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred'
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`
      
      // Handle specific error codes
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Bad Request'
          break
        case 401:
          errorMessage = 'Unauthorized access'
          break
        case 403:
          errorMessage = 'Access forbidden'
          break
        case 404:
          errorMessage = 'Resource not found'
          break
        case 500:
          errorMessage = 'Internal server error'
          break
        default:
          errorMessage = error.error?.message || `HTTP Error: ${error.status}`
      }
    }
    
    console.error('HTTP Error:', error)
    return throwError(() => new Error(errorMessage))
  }

  /**
   * Specific error handler for upload operations
   * @param error - HTTP error response
   * @returns Observable error
   */
  private handleUploadError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Upload failed'
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Upload Error: ${error.error.message}`
    } else {
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Invalid upload request. Please check file format and size.'
          break
        case 413:
          errorMessage = 'File too large. Please select a smaller file.'
          break
        case 415:
          errorMessage = 'Unsupported file type. Please select a valid image file.'
          break
        case 422:
          errorMessage = 'Invalid file data. Please try again with a different file.'
          break
        default:
          errorMessage = error.error?.message || `Upload failed: ${error.status}`
      }
    }
    
    console.error('Upload Error:', error)
    return throwError(() => new Error(errorMessage))
  }

  /**
   * Utility method to create FormData for file uploads
   * @param files - Files to upload
   * @param additionalData - Additional form fields
   * @returns FormData object
   */
  createFormData(files: File | File[], additionalData: { [key: string]: any } = {}): FormData {
    const formData = new FormData()
    
    if (Array.isArray(files)) {
      files.forEach(file => formData.append('files', file))
    } else {
      formData.append('file', files)
    }
    
    // Add additional data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key])
    })
    
    return formData
  }

  /**
   * Get file extension from filename
   * @param filename - Name of the file
   * @returns File extension
   */
  getFileExtension(filename: string): string {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
  }

  /**
   * Check if file is an image
   * @param file - File to check
   * @returns Boolean indicating if file is an image
   */
  isImageFile(file: File): boolean {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    return imageTypes.includes(file.type)
  }

  /**
   * Format file size for display
   * @param bytes - File size in bytes
   * @returns Formatted file size string
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}