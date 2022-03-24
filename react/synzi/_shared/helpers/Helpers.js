import moment from 'moment'

//-------------------------------------------------------------------------
// Convert a string of names into initials
//-------------------------------------------------------------------------
export const getInitials = name => {
  var names = name.split(' '),
    initials = names[0].substring(0, 1).toUpperCase()

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase()
  }
  return initials
}

/**
 * Truncate a string over a given length and add ellipsis
 * @param {string} str - string to be truncated
 * @param {integer} length - max length of the string before truncating
 * @return {string} truncated string
 */
export const truncate = (str, length) => {
  if (str.length > length) {
    return str.slice(0, length - 3) + '...'
  }

  return str
}

/**
 * Retrieve a string version of the date and time from a timestamp localized to the users browser
 * @param {string} dateTime - a UTC datetime stamp
 * @return {string} A string version of the date and time
 */
export const getLocalDateTime = dateTime => {
  return moment
    .utc(dateTime)
    .local()
    .format('LLL')
}

/**
 * Retrieve a string version of the date from a timestamp localized to the users browser
 * @param {string} dateTime - a UTC datetime stamp
 * @return {string} A string version of the date
 */
export const getLocalDate = dateTime => {
  return moment
    .utc(dateTime)
    .local()
    .format('ll')
}

/**
 * Retrieve a string version of the time from a timestamp localized to the users browser
 * @param {string} dateTime - a UTC datetime stamp
 * @return {string} A string version of the time
 */
export const getLocalTime = dateTime => {
  return moment
    .utc(dateTime)
    .local()
    .format('LT')
}

/**
 * Format a string into the phone number format of 'xxx-xxx-xxxx'. 
 * Any non-numeric characters will be stripped out prior to formatting.
 * 
 * @param {string} phone - a string
 * @return { {string}, {string} } An object of 2 strings - a raw phone and a formatted phone 
 */
export const formatPhone = phone => {
  if(phone === undefined || phone === null) {
    return phone
  }

  let maxPhoneLength = 10
  let formattedPhone = ''
  let rawPhone = phone.replace(/\D/g, '').substring(0, maxPhoneLength)
  const match = rawPhone.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/)
  if (match) {
    formattedPhone = `${match[1]}${match[2] ? '-' : ''}${match[2]}${match[3] ? '-' : ''}${match[3]}`
  }

  return {
    rawPhone, 
    formattedPhone
  } 
}

//-------------------------------------------------------------------------
// Find a specific error in a graphqlError object from apollo. This will
// search through the array of error objects and look for one with a
// matching value in the message property.
//
// param: errors - an error ojbect
// param: message - a string to search for
//
// return: true if found, false otherwise
//-------------------------------------------------------------------------
export const includesErrorMessage = (errors, message) => {
  if (!errors) return false
  if (!message) return false

  const found = errors.filter(error =>
    error.message.toLowerCase().includes(message.toLowerCase())
  )
  return found.length > 0
}
