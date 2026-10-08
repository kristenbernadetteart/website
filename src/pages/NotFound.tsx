import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container page">
      <div className="page__single">
        <h1>We couldn't find that page</h1>
        <p className="prose">
          The link may be out of date, or the content hasn't loaded. Try heading
          back to the gallery.
        </p>
        <p>
          <Link className="btn btn--primary" to="/">
            Back to all work
          </Link>
        </p>
      </div>
    </section>
  );
}
