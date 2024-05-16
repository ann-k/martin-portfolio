export function Controls({
  onClick,
  onSecondClick,
}: {
  onClick: () => void;
  onSecondClick: () => void;
}) {
  return (
    <>
      <button onClick={onClick}>картинки 1</button>
      <button onClick={onSecondClick}>картинки 2</button>
    </>
  );
}
