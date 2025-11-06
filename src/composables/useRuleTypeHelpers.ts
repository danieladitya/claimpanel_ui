export function useRuleTypeHelpers() {
  const getRuleTypeDescription = (typeId: string): string => {
    const descriptions: { [key: string]: string } = {
      'X002^001': 'Memeriksa kode ICD diagnosis/prosedur',
      'X002^002': 'Memeriksa kelengkapan dokumen berdasarkan diagnosis',
      'X002^003': 'Dokumen wajib untuk semua klaim (universal)'
    }
    return descriptions[typeId] || 'Tipe pemeriksaan'
  }

  const getRequiredConditionsTitle = (isUniversal: boolean, ruleType: string): string => {
    if (isUniversal) return 'Dokumen Wajib Universal'
    return ruleType === 'X002^001' ? 'Kode yang Diperlukan' : 'Dokumen yang Diperlukan'
  }

  const getRequiredConditionsDescription = (isUniversal: boolean, ruleType: string): string => {
    if (isUniversal) {
      return 'Tentukan dokumen apa yang wajib ada untuk SEMUA klaim, tanpa memandang diagnosis atau tindakan.'
    }
    return ruleType === 'X002^001' 
      ? 'Tentukan kode medis apa yang harus ada ketika kondisi pemicu terpenuhi.' 
      : 'Tentukan dokumen apa yang harus lengkap ketika diagnosis ditemukan.'
  }

  const getRuleTypeBadgeClass = (ruleType: string): string => {
    const classes: { [key: string]: string } = {
      'X002^001': 'px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800',
      'X002^002': 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800',
      'X002^003': 'px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800'
    }
    return classes[ruleType] || 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800'
  }

  const getRuleTypeBadgeText = (ruleType: string): string => {
    const texts: { [key: string]: string } = {
      'X002^001': 'Kode Medis ICD',
      'X002^002': 'Dokumen Kondisional',
      'X002^003': 'Dokumen Universal'
    }
    return texts[ruleType] || 'Unknown'
  }

  const getSeverityBadgeClass = (severity: string): string => {
    const classes: { [key: string]: string } = {
      'X004^001': 'px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800',
      'X004^002': 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800',
      'X004^003': 'px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800'
    }
    return classes[severity] || 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800'
  }

  const getSeverityBadgeText = (severity: string): string => {
    const texts: { [key: string]: string } = {
      'X004^001': '❌ ERROR',
      'X004^002': '⚠️ WARNING',
      'X004^003': 'ℹ️ INFO'
    }
    return texts[severity] || 'UNKNOWN'
  }

  const getModeDescription = (mode: string): string => {
    const descriptions: { [key: string]: string } = {
      'X003^001': 'Semua harus ada',
      'X003^002': 'Minimal satu harus ada', 
      'X003^003': 'Harus tepat'
    }
    return descriptions[mode] || mode
  }

  const getSeverityDescription = (severity: string): string => {
    const descriptions: { [key: string]: string } = {
      'X004^001': 'Akan memblokir proses',
      'X004^002': 'Peringatan saja',
      'X004^003': 'Informasi tambahan'
    }
    return descriptions[severity] || 'Tidak diketahui'
  }

  const getICDCodeDescription = (code: string): string => {
    const descriptions: {[key: string]: string} = {
      'E10': 'Diabetes mellitus tergantung insulin',
      'E11': 'Diabetes mellitus tidak tergantung insulin', 
      'I10': 'Hipertensi esensial (primer)',
      'J45': 'Asma',
      'N18': 'Penyakit ginjal kronik',
      'A01': 'Demam tifoid dan paratifoid'
    };
    
    const baseCode = code.split('.')[0];
    return descriptions[baseCode] || descriptions[code] || 'Kode diagnosis ICD';
  }

  return {
    getRuleTypeDescription,
    getRequiredConditionsTitle,
    getRequiredConditionsDescription,
    getRuleTypeBadgeClass,
    getRuleTypeBadgeText,
    getSeverityBadgeClass,
    getSeverityBadgeText,
    getModeDescription,
    getSeverityDescription,
    getICDCodeDescription
  }
}