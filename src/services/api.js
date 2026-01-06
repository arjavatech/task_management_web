/**
 * API Service for Task Management Application
 * 
 * NOTE: This application uses Firebase/Firestore for all data operations.
 * External API endpoints are not currently in use.
 * 
 * All data operations are handled through:
 * - src/services/firebaseService.js (Firebase operations)
 * - src/hooks/useApi.js (API wrapper with retry logic)
 * 
 * If external API integration is needed in the future, 
 * see api.backup.js for reference implementation.
 */

console.log('TaskFlow uses Firebase/Firestore for data operations')

export default {
  info: 'This application uses Firebase/Firestore for all data operations'
}