// funzione per mettere i punti decimale oppure la virgola
export default function pointsDecimal(Points, typeDivisor = ".") {
  // Points = 1050215;
  let Point = Points;
  if (typeDivisor === ",") {
    Point = parseFloat(Points).toFixed(2);
  }
  Point = Point.toString();
  Point = Point.replace(".", ",");

  return Point.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
