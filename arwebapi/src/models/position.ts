class Position {
  public type: string;
  public coordinates: number[];

  constructor() {
    this.type = "Point";
    this.coordinates = [0.0, 0.0];
  }
}

export default Position;
