import { ref } from "vue"

// composables/useMessageSuggestions.ts
export function useMessageSuggestions() {
    const messageSuggestions = ref<string[]>([])
  
    const getMessagePlaceholder = (isUniversal: boolean, ruleType: string): string => {
      if (isUniversal) {
        return 'Contoh: Dokumen SEP wajib dilampirkan untuk semua klaim'
      }
      return ruleType === 'X002^001' 
        ? 'Contoh: Diagnosis diabetes memerlukan obat diabetes yang sesuai'
        : 'Contoh: Diagnosis hipertensi memerlukan hasil pemeriksaan tekanan darah'
    }
  
    const getTriggerCodeDescription = (triggerCode: string): string => {
      const codeDescriptions: { [key: string]: string } = {
        'E11': 'Diabetes Mellitus Tipe 2',
        'I10': 'Hipertensi Esensial', 
        'J45': 'Asma',
        'N18': 'Penyakit Ginjal Kronik',
        'Z01.81': 'Pemeriksaan Pre-Operasi',
        'I25': 'Penyakit Jantung Iskemik',
        'E78': 'Gangguan Metabolisme Lipid',
        'M54': 'Nyeri Punggung'
      }
      return codeDescriptions[triggerCode] || 'Kode diagnosis/prosedur'
    }
  
    const getCodeOrDocumentLabel = (code: string, ruleType: string, documentOptions: any[], getDocumentTypeLabel: Function): string => {
      if (ruleType === 'X002^002' || ruleType === 'X002^003') {
        const universalDoc = documentOptions.find(doc => doc.value === code)
        if (universalDoc) return universalDoc.label
        return getDocumentTypeLabel(code) || 'Dokumen'
      }
      
      const codeDescriptions: { [key: string]: string } = {
        'A10BA': 'Metformin',
        'A10BB': 'Sulfonylurea',
        'A10AC': 'Insulin',
        'C09CA': 'ACE Inhibitor',
        'C07AB': 'Beta Blocker',
        '99213': 'Kunjungan Rawat Jalan',
        '80048': 'Panel Metabolik Dasar'
      }
      return codeDescriptions[code] || 'Kode Medis'
    }
  
    const updateMessageSuggestions = (
      isUniversal: boolean, 
      ruleType: string, 
      triggerCode: string, 
      requiredCodes: string[], 
      documentOptions: any[],
      getDocumentTypeLabel: Function
    ) => {
      const suggestions = []
      
      if (isUniversal) {
        const requiredItems = requiredCodes.filter(doc => doc.trim())
          .map(doc => {
            const docOption = documentOptions.find(d => d.value === doc)
            return docOption ? docOption.label : doc
          })
          .join(', ')
        
        if (requiredItems) {
          suggestions.push(
            `Dokumen ${requiredItems} wajib dilampirkan untuk semua klaim`,
            `Pastikan dokumen ${requiredItems} lengkap sebelum proses klaim`,
            `Kelengkapan dokumen ${requiredItems} merupakan syarat wajib semua klaim`
          )
        }
      } else if (triggerCode && requiredCodes.length > 0) {
        const triggerDesc = getTriggerCodeDescription(triggerCode)
        const requiredItems = requiredCodes.filter(c => c.trim()).map(code => 
          getCodeOrDocumentLabel(code, ruleType, documentOptions, getDocumentTypeLabel)
        ).join(', ')
        
        if (ruleType === 'X002^001') {
          suggestions.push(
            `Diagnosis ${triggerDesc} memerlukan ${requiredItems}`,
            `Untuk ${triggerDesc}, pastikan tersedia ${requiredItems}`,
            `${triggerDesc} harus disertai dengan ${requiredItems}`
          )
        } else {
          suggestions.push(
            `Diagnosis ${triggerDesc} memerlukan dokumen ${requiredItems}`,
            `Kelengkapan dokumen ${requiredItems} diperlukan untuk ${triggerDesc}`,
            `Pastikan dokumen ${requiredItems} lengkap untuk pasien ${triggerDesc}`
          )
        }
      }
      
      messageSuggestions.value = suggestions
    }
  
    return {
      messageSuggestions,
      getMessagePlaceholder,
      updateMessageSuggestions
    }
  }