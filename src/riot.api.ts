import axios from 'axios';
import { MatchData, MatchPreview } from './types';

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://gxp-api-277f714413c2.herokuapp.com'

export async function getMatchPreviews(name: string, tag: string): Promise<MatchPreview[]> {
    try {
    const response = await axios.get(`${BASE_URL}/matchPreviews?name=${name}&tag=${tag}`);
    return response.data;
  } catch (error) {
    console.error('Error getting match preview data:', error);
    throw error;
  }
}

export async function getMatchData(id: string, accountId: string): Promise<MatchData> {
  try {
    const response = await axios.get(`${BASE_URL}/match?id=${id}&accountId=${accountId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting match data:', error);
    throw error;
  }
}