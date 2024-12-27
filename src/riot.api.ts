import axios from 'axios';
import { MatchData, MatchPreview } from './types';
import { exampleData } from './example-match-data';
import { exampleDataMcnutt } from './report-mcnutt-hundred';

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

export async function getMatchPreview(matchId: string, accountId: string): Promise<MatchPreview> {
  try {
  const response = await axios.get(`${BASE_URL}/matchPreview?matchId=${matchId}&accountId=${accountId}`);
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

export async function getTrendData(name: string, tag: string, sampleSize: number): Promise<any> {
   try {
      // const response = await axios.get(`${BASE_URL}/trends?name=${name}&tag=${tag}&sampleSize=${sampleSize}`)
      const response = exampleDataMcnutt;
      console.log(response);
      return response.data;
   } catch (error) {
      console.log('Error getting trend data');
      throw error;
   }
}