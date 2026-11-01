import { useEffect, useRef } from "react";

export default function PageHeading({ title, className }) {
  const headingRef = useRef(null);

  useEffect(() => {
    document.title = `${title} | Mellemrum`;
    headingRef.current?.focus();
  }, [title]);

  return (
    <h1 ref={headingRef} tabIndex={-1} className={className}>
      {title}
    </h1>
  );
}
