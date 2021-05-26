export const NOTICE_COLOURS = Object.freeze({
  red: {
    light: '#ffb3b3',
    dark: '#f79898',
  },
  orange: {
    light: '#ffdfb3',
    dark: '#ffcc85',
  },
  green: {
    light: '#b3ffb3',
    dark: '#8aec8a',
  },
})

export const ICON_COLOURS = Object.freeze({
  red: {
    light: '#ff4136',
    dark: '',
  },
  orange: {
    light: '#ff851b',
    dark: '',
  },
  green: {
    light: '#33de46',
    dark: '',
  },
  grey: {
    light: '#888',
    dark: '',
  },
})

// Status Descriptions
export const STATUS_OPERATIONAL = 'All systems operational'
export const STATUS_DEGRADED = 'Some services are experiencing outages'
export const STATUS_OUTAGES = 'Some services are experiencing outages'
export const STATUS_UNKNOWN = 'We are having trouble reaching some services'

// Status Icons
export const ICON_OPERATIONAL = '/operational.ico'
export const ICON_DEGRADED = '/degraded.ico'
export const ICON_OUTAGES = '/outages.ico'
export const ICON_UNKNOWN = '/unknown.ico'