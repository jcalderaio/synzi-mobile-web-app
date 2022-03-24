import { defaultTo } from 'lodash'

export const canCallStaff = perms => {
    if (!perms) return false
  
    const hasPermission = perms.filter(perm => perm.code.includes('call_staff'))
    return hasPermission.length > 0
  }
  
  export const canCallPatients = perms => {
    if (!perms) return false
  
    const hasPermission = perms.filter(perm => perm.code.includes('call_patient'))
    return hasPermission.length > 0
  }

  export const messagesEnabled = user => {
    if (!user) return false
  
    // there are permissions
    const perms = defaultTo(user.enterprise.permissionsByType, [])
    if (perms.length === 0) return false
  
    const hasPermission = perms.filter(perm =>
      perm.code.includes('secure_messaging')
    )
  
    if (hasPermission.length === 0) return false
  
    return hasPermission[0].isActive
  }
  
  export const onDemandmessagesEnabled = user => {
    if (!user) return false
  
    // there are permissions
    const perms = defaultTo(user.enterprise.permissionsByType, [])
    if (perms.length === 0) return false
  
    const hasPermission = perms.filter(perm => perm.code === 'on_demand_contact')
  
    if (hasPermission.length === 0) return false
  
    return hasPermission[0].isActive
  }

  export const interpreterEnabled = user => {
    if (!user) return false
  
    // there are permissions
    const perms = defaultTo(user.enterprise.permissionsByType, [])
    if (perms.length === 0) return false
  
    const hasPermission = perms.filter(perm => perm.code === 'language_services_integration')
  
    if (hasPermission.length === 0) return false
  
    return hasPermission[0].isActive
  }