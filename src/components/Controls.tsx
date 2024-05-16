export function Controls({
  onClick,
}: {
  onClick: (projectId: number) => void;
}) {
  return (
    <>
      {[...Array(10).keys()].map((n) => {
        return (
          <button key={n} onClick={() => onClick(n)}>
            картинки {n}
          </button>
        );
      })}
    </>
  );
}
