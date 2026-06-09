export interface User {
    id: number 
    username: string
    email: string 
    is_premium: boolean
    subscription_end_date: string | null
}


export interface Round {
    id: number
    score: number
    course_name: string
    course_rating: number
    slope_rating: number
    date_played: string
    weather: 'sunny' | 'cloudy' | 'windy' | 'rainy' | null
    wind_strength: 'none' | 'light' | 'moderate' | 'strong' | null
    green_speed: 'slow' | 'normal' | 'fast' | null
    green_firmness: 'soft' | 'normal' | 'firm' | null
    fairway_conditions: 'wet' | 'normal' | 'dry' | 'firm' | null
    miss_category: 'driving' | 'iron_play' | 'chipping' | 'putting' | 'bunker' | null
    notes: string | null
    score_differential: number
    created_at: string
}


export interface RoundFormData {
  score: number
  course_name: string
  course_rating: number
  slope_rating: number
  date_played: string
  weather: Round['weather']
  wind_strength: Round['wind_strength']
  green_speed: Round['green_speed']
  green_firmness: Round['green_firmness']
  fairway_conditions: Round['fairway_conditions']
  miss_category: Round['miss_category']
  notes: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
}
