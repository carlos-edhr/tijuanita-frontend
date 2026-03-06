// Add this helper function at the top of your component or in a separate utils file
export const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return 'Not set'
  
  try {
    // Handle date string that might be in different formats
    let date: Date
    
    if (dateString.includes('T')) {
      // ISO string with time
      date = new Date(dateString)
    } else {
      // Simple YYYY-MM-DD format
      const [year, month, day] = dateString.split('-').map(Number)
      
      // Create date at noon to avoid timezone issues
      date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
    }
    
    // Format for display
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString || 'Not set'
  }
}