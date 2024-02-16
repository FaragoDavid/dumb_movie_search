export type MovieResponse = {
  title: string;
  description: string;
  imageSrc: string;
};

export default class ApiService {
  private SERVICE_URL = 'http://localhost:8080';
  private JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDgwOTYyMTN9.Ruf4GjQBw75PrjVyvo9qDgwcjjehDJ6WO2Dmb0uCMLQ';

  public async fetchMovies(query: string) {
    const response = await window.fetch(`${this.SERVICE_URL}/v1/movies?query=${query}`, {
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${this.JWT_SECRET}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return (await response.json()) as MovieResponse[];
  }
}
