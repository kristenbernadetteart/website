import { Link } from "react-router-dom";
import { tinaField } from "tinacms/dist/react";
import { formatPrice } from "../lib/format";
import { lowestPrice, type Print } from "../lib/prints";
import { printBorderStyle } from "../lib/site";

export default function PrintCard({
  print,
  borderWidth,
}: {
  print: Print;
  borderWidth?: number | null;
}) {
  const from = lowestPrice(print);

  return (
    <Link className="card" to={`/prints/${print._sys.filename}`}>
      <div className="mat mat--print" style={printBorderStyle(borderWidth)}>
        {print.image && (
          <img
            src={print.image}
            alt={print.imageAlt || print.title}
            loading="lazy"
          />
        )}
      </div>
      <div className="card__body">
        <h3 className="card__title" data-tina-field={tinaField(print, "title")}>
          {print.title}
        </h3>
        {print.printType && <p className="muted">{print.printType}</p>}
        <div className="card__foot">
          <span className="price">
            {from !== null && `From ${formatPrice(from)}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
