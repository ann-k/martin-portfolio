export function Project({
  onClose,
  activeProject,
}: {
  activeProject: number;
  onClose: () => void;
}) {
  return (
    <>
      <div className="dialog-backdrop" />
      <div className="dialog-layer">
        <div role="dialog" aria-labelledby="dialog-label" aria-modal="true">
          <div>
            <img src={`/images/${activeProject}.jpeg`} />
          </div>

          <div className="dialog-description">
            <h2 id="dialog-label">Project title</h2>

            <div className="text">
              <p>
                Душа моя озарена неземной радостью, как эти чудесные весенние
                утра, которыми я наслаждаюсь от всего сердца. Я совсем один и
                блаженствую в здешнем краю, словно созданном для таких, как я.
              </p>

              <p>
                Я так счастлив, мой друг, так упоен ощущением покоя, что
                искусство мое страдает от этого. Ни одного штриха не мог бы я
                сделать, а никогда не был таким большим художником, как в эти
                минуты.
              </p>
            </div>

            <div>
              <a className="link" href="">
                ССЫЛКА
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="dialog-close-button"
          />
        </div>
      </div>
    </>
  );
}
