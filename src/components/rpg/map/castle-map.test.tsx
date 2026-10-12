import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ROOM_BOUNDS, type PlanRoomId } from "@/lib/castle-plan";
import { CastleMap } from "./castle-map";
import {
  ArsenalFurnishings,
  HallFurnishings,
  LabFurnishings,
  LibraryFurnishings,
  QuartersFurnishings,
  ThroneFurnishings,
} from "./room-furnishings";

const names: Record<PlanRoomId, string> = {
  B: "Biblioteca",
  T: "Sala do trono",
  L: "Laboratório",
  R: "Arsenal",
  A: "Aposentos",
  H: "Entrada",
};

describe("castle map component", () => {
  const html = renderToStaticMarkup(<CastleMap names={names} activeRoom="B" visited={["T"]} />);

  it("composes one furnishing component per room", () => {
    for (const id of Object.keys(ROOM_BOUNDS)) expect(html).toContain(`data-room="${id}"`);
  });
  it("renders each room component on its own", () => {
    for (const Room of [
      LibraryFurnishings,
      ThroneFurnishings,
      LabFurnishings,
      ArsenalFurnishings,
      HallFurnishings,
      QuartersFurnishings,
    ]) {
      expect(
        renderToStaticMarkup(
          <svg>
            <Room />
          </svg>,
        ),
      ).toContain("data-room=");
    }
  });
  it("labels every room and marks visited ones", () => {
    for (const name of Object.values(names)) expect(html).toContain(name.toUpperCase());
  });
  it("uses the 640x520 plan and stays decorative for assistive technology", () => {
    expect(html).toContain('viewBox="0 0 640 520"');
    expect(html).toContain('aria-hidden="true"');
  });
});
