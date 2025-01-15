import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { S3 } from '@aws-sdk/client-s3';

// Fallback storage using localStorage
const localStorageDB = {
  getItem: (key: string) => {
    try {
      return JSON.parse(localStorage.getItem(key) || '');
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
};

// AWS Configuration
export const awsConfig = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''
  }
};

// Initialize AWS clients with fallback mechanisms
export const createAWSClients = () => {
  try {
    const dynamoDB = new DynamoDB(awsConfig);
    const s3 = new S3(awsConfig);
    
    return {
      // DynamoDB wrapper with fallback
      db: {
        async saveGameState(userId: string, gameState: any) {
          try {
            await dynamoDB.putItem({
              TableName: 'NeonGenesisGameState',
              Item: {
                userId: { S: userId },
                gameState: { S: JSON.stringify(gameState) },
                timestamp: { N: Date.now().toString() }
              }
            });
          } catch (error) {
            console.warn('Falling back to localStorage for game state', error);
            localStorageDB.setItem(`gameState_${userId}`, gameState);
          }
        },
        async loadGameState(userId: string) {
          try {
            const result = await dynamoDB.getItem({
              TableName: 'NeonGenesisGameState',
              Key: { userId: { S: userId } }
            });
            return result.Item ? JSON.parse(result.Item.gameState.S || '{}') : null;
          } catch (error) {
            console.warn('Falling back to localStorage for game state', error);
            return localStorageDB.getItem(`gameState_${userId}`);
          }
        }
      },
      // S3 wrapper with fallback
      storage: {
        async getAsset(key: string) {
          try {
            const result = await s3.getObject({
              Bucket: 'neogenesis-assets',
              Key: key
            });
            return result.Body;
          } catch (error) {
            console.warn('Falling back to local assets', error);
            return `/assets/${key}`; // Fallback to local assets
          }
        }
      }
    };
  } catch (error) {
    console.warn('AWS services unavailable, using local storage', error);
    return {
      db: {
        saveGameState: (userId: string, gameState: any) => 
          localStorageDB.setItem(`gameState_${userId}`, gameState),
        loadGameState: (userId: string) => 
          localStorageDB.getItem(`gameState_${userId}`)
      },
      storage: {
        getAsset: (key: string) => Promise.resolve(`/assets/${key}`)
      }
    };
  }
};