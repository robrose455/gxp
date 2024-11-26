import axios from 'axios';

export async function getMatchPreviews(name: string, tag: string) {
    try {
    const response = await axios.get(`http://localhost:4000/matchPreviews?name=${name}&tag=${tag}`);
    return response.data;
  } catch (error) {
    console.error('Error getting match preview data:', error);
    throw error;
  }
}

export async function getMatchData(id: string, accountId: string) {
  try {
    const response = await axios.get(`http://localhost:4000/match?id=${id}&accountId=${accountId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting match data:', error);
    throw error;
  }
}