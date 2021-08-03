export class Weather {
  constructor(
    private description: string,
    private icon: string,
    private temperature: number,
    private humidity: number,
    private cloudsPercentage: number,
    private windSpeed: number
  ) {}

  getDescription() {
    return this.description;
  }

  getIcon() {
    return this.icon;
  }

  getTemperature() {
    return this.temperature;
  }

  getHumidity() {
    return this.humidity;
  }

  getCloudsPercentage() {
    return this.cloudsPercentage;
  }

  getWindSpeed() {
    return this.windSpeed;
  }
}
