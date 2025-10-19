/**
 * Format tanggal dari string ISO ke format Indonesia
 * @param dateString - String tanggal ISO (contoh: 2025-09-24T15:21:16.729657+00:00)
 * @param options - Opsi format tambahan
 * @returns String tanggal yang diformat
 */
export function formatDate(
    dateString: string, 
    options: {
      withTime?: boolean;
      locale?: string;
      timeZone?: string;
    } = {}
  ): string {
    const { withTime = false, locale = 'id-ID', timeZone = 'Asia/Jakarta' } = options;
  
    try {
      const date = new Date(dateString);
      
      // Validasi jika date invalid
      if (isNaN(date.getTime())) {
        return 'Tanggal tidak valid';
      }
  
      const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: timeZone
      };
  
      if (withTime) {
        dateOptions.hour = '2-digit';
        dateOptions.minute = '2-digit';
        dateOptions.second = '2-digit';
      }
  
      return date.toLocaleDateString(locale, dateOptions);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Format tanggal error';
    }
  }
  
  /**
   * Format tanggal singkat (dd/mm/yyyy)
   */
  export function formatShortDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Asia/Jakarta'
      });
    } catch (error) {
      console.error('Error formatting short date:', error);
      return 'Error';
    }
  }
  
  /**
   * Format tanggal dengan waktu lengkap
   */
  export function formatDateTime(dateString: string): string {
    return formatDate(dateString, { withTime: true });
  }
  
  /**
   * Format relative time (contoh: "2 jam yang lalu")
   */
  export function formatRelativeTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
  
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
  
      if (diffInSeconds < 60) {
        return 'Baru saja';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} menit yang lalu`;
      } else if (diffInHours < 24) {
        return `${diffInHours} jam yang lalu`;
      } else if (diffInDays < 7) {
        return `${diffInDays} hari yang lalu`;
      } else {
        return formatDate(dateString);
      }
    } catch (error) {
      console.error('Error formatting relative time:', error);
      return formatDate(dateString);
    }
  }
  
  /**
   * Format untuk display di table (singkat)
   */
  export function formatDateForTable(dateString: string): string {
    return formatShortDate(dateString);
  }
  
  /**
   * Format untuk display detail (lengkap dengan waktu)
   */
  export function formatDateForDetail(dateString: string): string {
    return formatDateTime(dateString);
  }