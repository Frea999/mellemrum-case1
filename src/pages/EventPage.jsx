import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import PageHeading from "../components/PageHeading";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getEvent() {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/events?id=eq.${eventId}`,
          { headers },
        );

        if (!response.ok) {
          throw new Error(`Kunne ikke hente event: ${response.status}`);
        }

        const data = await response.json();
        setEvent(data[0]);
      } catch (error) {
        console.error(error);
        setError("Vi kunne ikke hente eventet. Prøv igen om lidt.");
      } finally {
        setIsLoading(false);
      }
    }

    getEvent();
  }, [eventId]);

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${SUPABASE_URL}/registrations`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name, email, eventId: event.id }),
      });

      if (!response.ok) {
        throw new Error(`Tilmelding fejlede: ${response.status}`);
      }

      setName("");
      setEmail("");
      setMessage(`Tak! Du er tilmeldt ${event.title}.`);
    } catch (error) {
      console.error(error);
      setMessage("Vi kunne ikke gemme din tilmelding. Prøv igen om lidt.");
    }
  }

  if (isLoading) {
    return (
      <main className="event-page">
        <p role="status">Henter event…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="event-page">
        <PageHeading title="Noget gik galt" />
        <p role="alert">{error}</p>
        <Link to="/">← Se alle events</Link>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="event-page">
        <PageHeading title="Eventet findes ikke" />
        <p>Det event, du leder efter, findes ikke eller er blevet fjernet.</p>
        <Link to="/">← Se alle events</Link>
      </main>
    );
  }

  const date = new Date(event.date);

  return (
    <>
      <main className="event-page">
        <Link className="back-link" to="/">
          ← Alle events
        </Link>

        <section className="event-detail">
          <img src={event.image} alt="" />
          <div className="event-detail-content">
            <p className="event-category">{event.category}</p>
            <PageHeading title={event.title} />
            <p className="lead">{event.summary}</p>
            <div className="detail-list">
              <p>
                <strong>Dato</strong>
                {date.toLocaleDateString("da-DK", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                kl.{" "}
                {date.toLocaleTimeString("da-DK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Sted</strong>
                <span>
                  {event.venueName}
                  <br />
                  {event.venueAddress}, {event.venuePostalCode}{" "}
                  {event.venueCity}
                  {event.venueWebsite && (
                    <>
                      <br />
                      <a href={event.venueWebsite}>Besøg venue</a>
                    </>
                  )}
                </span>
              </p>
              <p>
                <strong>Pris</strong>
                {event.price === 0 ? "Gratis" : `${event.price} kr.`}
              </p>
            </div>
            <p>{event.description}</p>
          </div>
        </section>

        <section className="signup-panel">
          <div>
            <p className="eyebrow dark">Tilmelding</p>
            <h2>Reserver din plads</h2>
            <p>
              Udfyld formularen, så sender vi din tilmelding til arrangøren.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Navn
              <input
                value={name}
                onChange={(inputEvent) => setName(inputEvent.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(inputEvent) => setEmail(inputEvent.target.value)}
                placeholder="dig@example.com"
                autoComplete="email"
                required
              />
            </label>
            <button type="submit">Tilmeld mig</button>
            <p role="status">{message}</p>
          </form>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-intro">
            <p className="footer-brand">
              mellemrum<span>.</span>
            </p>
            <p>Udvalgte kulturoplevelser og nye perspektiver på Aarhus.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <div className="footer-link-group">
              <p className="footer-heading">Udforsk</p>
              <Link to="/">Events</Link>
              <Link to="/om">Om Mellemrum</Link>
            </div>
            <div className="footer-link-group">
              <p className="footer-heading">For arrangører</p>
              <Link to="/tilmeldinger">Se tilmeldinger</Link>
              <a href="mailto:hej@mellemrum.dk">Kontakt os</a>
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-meta">© 2025 Mellemrum</p>
          <p>Aarhus, Danmark</p>
        </div>
      </footer>
    </>
  );
}
