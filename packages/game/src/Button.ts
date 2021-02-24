import {
  useNewComponent,
  useEntityName,
  Vector,
  Polygon,
  useDraw,
  useUpdate,
  Mouse,
  Label,
  useType,
  Geometry,
} from "@hex-engine/2d";
import useGameFont from "./useGameFont";

export default function Button({
  calcPosition,
  text,
  onClick,
}: {
  calcPosition: (bounds: Vector) => Vector;
  text: string;
  onClick: () => void;
}) {
  useType(Button);
  useEntityName(`Button - ${text}`);

  const font = useGameFont();
  const label = useNewComponent(() => Label({ text, font }));

  const padding = 3;
  function calcSize() {
    const metrics = font.measureText(label.text);
    return new Vector(metrics.width, metrics.height)
      .add(padding * 2)
      .roundMutate();
  }

  let currentSize = calcSize();

  const geometry = useNewComponent(() =>
    Geometry({ shape: Polygon.rectangle(currentSize) })
  );

  const mouse = useNewComponent(Mouse);

  mouse.onClick(onClick);

  useUpdate(() => {
    const previousSize = currentSize;
    currentSize = calcSize();
    if (!previousSize.equals(currentSize)) {
      geometry.position.mutateInto(calcPosition(currentSize));
      geometry.shape = Polygon.rectangle(currentSize);
    }
  });

  useDraw(
    (context) => {
      context.fillStyle =
        mouse.isPressingLeft && mouse.isInsideBounds
          ? "#aaa"
          : mouse.isInsideBounds
          ? "#ddd"
          : "#eee";
      const rect = currentSize.round();
      context.fillRect(0, 0, rect.x, rect.y);
      label.draw(context, { x: padding, y: padding, baseline: "top" });
    },
    { roundToNearestPixel: true }
  );
}
