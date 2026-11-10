import { useState, type FormEvent } from "react";
import { useLoaderData } from "react-router-dom";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tinaField, useTina } from "tinacms/dist/react";
import client from "../../tina/__generated__/client";
import { useSite } from "../lib/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";

export const loader = () =>
  client.queries.commissionsPage({ relativePath: "commissions.md" });

type Page = Awaited<ReturnType<typeof loader>>["data"]["commissionsPage"];

export default function Commissions() {
  const { data } = useTina(
    useLoaderData() as Awaited<ReturnType<typeof loader>>,
  );
  const page = data.commissionsPage;
  const site = useSite();
  const heading = page.title || "Commissions";

  useDocumentTitle(heading, site.artistName);

  return (
    <article className="container page commissions">
      <h1 data-tina-field={tinaField(page, "title")}>{heading}</h1>
      {page.body && (
        <div className="prose" data-tina-field={tinaField(page, "body")}>
          <TinaMarkdown content={page.body} />
        </div>
      )}
      <CommissionForm page={page} fallbackEmail={site.contactEmail} />
    </article>
  );
}

function CommissionForm({
  page,
  fallbackEmail,
}: {
  page: Page;
  fallbackEmail: string;
}) {
  const questions = (page.questions ?? []).flatMap((q) =>
    q?.question ? [{ ...q, question: q.question }] : [],
  );
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const to = page.email || fallbackEmail;
    const subject = page.subject || "Commission request";
    const body = questions
      .map((q, i) => `${q.question}\r\n${(answers[i] ?? "").trim() || "—"}`)
      .join("\r\n\r\n");
    window.location.href =
      `mailto:${encodeURIComponent(to)}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="commission-form" onSubmit={onSubmit}>
      {questions.map((q, i) => {
        const id = `commission-q${i}`;
        return (
          <div key={i} className="field" data-tina-field={tinaField(q, "question")}>
            <label htmlFor={id} className="field__label">
              {q.question}
              {q.required && <span className="field__required"> (required)</span>}
            </label>
            <textarea
              id={id}
              className="field__input"
              rows={4}
              required={!!q.required}
              placeholder={q.placeholder ?? undefined}
              value={answers[i] ?? ""}
              onChange={(e) =>
                setAnswers((a) => ({ ...a, [i]: e.target.value }))
              }
            />
          </div>
        );
      })}

      <div className="commission-form__actions">
        <button
          type="submit"
          className="btn btn--primary"
          data-tina-field={tinaField(page, "buttonText")}
        >
          {page.buttonText || "Send request"}
        </button>
        {page.note && (
          <p className="muted" data-tina-field={tinaField(page, "note")}>
            {page.note}
          </p>
        )}
      </div>
    </form>
  );
}
