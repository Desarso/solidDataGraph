import { createSignal, Accessor, Setter } from "solid-js";

interface Draggable {
  id: string;
  startingPosition: { x: number; y: number };
  dragStart: Function[];
  dragEnd: Function;
  ref: any;
  rectangle: any;
  data: any;
  init: Function;
}

interface Droppable {
  id: string;
  startingPosition: { x: number; y: number };
  hoverOver: Function;
  hoverOut: Function;
  ref: any;
  rectangle: any;
  hovering: boolean;
  occupied: boolean;
  droppable: boolean;
  init: Function;
}

//I need a drag start assignable function for both draggable and droppable

// const DragDropContext = createContext<ContextProps>();
interface position {
  x: number;
  y: number;
}

interface HTMLDivElement {
  ref: any;
  id: string;
  classList: DOMTokenList;
}
export class DragNDrop {
  //here we are keeping track of some of the global states
  //so we need a function to createDraggable, this function should

  static mousePosition: Accessor<position>;
  static setMousePosition: Setter<position>;
  static startingMousePosition: Accessor<position>;
  static setStartingMousePosition: Setter<position>;
  static cursorDown: Accessor<boolean>;
  static setCursorDown: Setter<boolean>;
  static target: Accessor<Draggable>;
  static setTarget: Setter<Draggable>;
  static previousTarget: Accessor<Draggable>;
  static setPreviousTarget: Setter<Draggable>;
  static previousPosition: Accessor<position>;
  static setPreviousPosition: Setter<position>;
  static overlapped: Accessor<Droppable[]>;
  static setOverlapped: Setter<Droppable[]>;
  static hovered: Accessor<Droppable>;
  static setHovered: Setter<Droppable>;
  static virtualMousePosition: Accessor<position>;
  static setVirtualMousePosition: Setter<position>;
  static virtualStartingMousePosition: Accessor<position>;
  static setVirtualStartingMousePosition: Setter<position>;
  static virtualCursorDown: Accessor<boolean>;
  static setVirtualCursorDown: Setter<boolean>;
  static virtualTarget: Accessor<Draggable>;
  static setVirtualTarget: Setter<Draggable>;
  static virtualPreviousTarget: Accessor<Draggable>;
  static setVirtualPreviousTarget: Setter<Draggable>;
  static virtualPreviousPosition: Accessor<position>;
  static setVirtualPreviousPosition: Setter<position>;
  static virtualOverlapped: Accessor<Droppable[]>;
  static setVirtualOverlapped: Setter<Droppable[]>;
  static virtualHovered: Accessor<Droppable>;
  static setVirtualHovered: Setter<Droppable>;
  static droppables: Accessor<Droppable[]>;
  static setDropables: Setter<Droppable[]>;
  static globalDragStart: Function[];
  static globalDragEnd: Function[];

  static init() {
    const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });

    const [startingMousePosition, setStartingMousePosition] = createSignal({
      x: 0,
      y: 0,
    });
    const [cursorDown, setCursorDown] = createSignal(false);
    const [target, setTarget] = createSignal(null as unknown as Draggable);
    const [previousTarget, setPreviousTarget] = createSignal(null);
    const [previousPosition, setPreviousPosition] = createSignal({
      x: 0,
      y: 0,
    });
    const [overlapped, setOverlapped] = createSignal(
      [] as unknown as Droppable[]
    );
    const [hovered, setHovered] = createSignal(null as unknown as Droppable);

    //all variables for virtual mouse
    const [virtualMousePosition, setVirtualMousePosition] = createSignal({
      x: 0,
      y: 0,
    });
    const [virtualStartingMousePosition, setVirtualStartingMousePosition] =
      createSignal({ x: 0, y: 0 });
    const [virtualCursorDown, setVirtualCursorDown] = createSignal(false);
    const [virtualTarget, setVirtualTarget] = createSignal(
      null as unknown as Draggable
    );
    const [virtualPreviousTarget, setVirtualPreviousTarget] = createSignal(
      null as unknown as Draggable
    );
    const [virtualPreviousPosition, setVirtualPreviousPosition] = createSignal({
      x: 0,
      y: 0,
    });
    const [virtualOverlapped, setVirtualOverlapped] = createSignal(
      [] as unknown as Droppable[]
    );
    const [virtualHovered, setVirtualHovered] = createSignal(
      null as unknown as Droppable
    );

    const [droppables, setDropables] = createSignal([] as Droppable[]);

    const globalDragStart: Function[] = [];
    const globalDragEnd: Function[] = [];

    DragNDrop.mousePosition = mousePosition;
    DragNDrop.setMousePosition = setMousePosition;
    DragNDrop.startingMousePosition = startingMousePosition;
    DragNDrop.setStartingMousePosition = setStartingMousePosition;
    DragNDrop.cursorDown = cursorDown;
    DragNDrop.setCursorDown = setCursorDown;
    DragNDrop.target = target;
    DragNDrop.setTarget = setTarget;
    DragNDrop.previousTarget = previousTarget as any;
    DragNDrop.setPreviousTarget = setPreviousTarget as any;
    DragNDrop.previousPosition = previousPosition;
    DragNDrop.setPreviousPosition = setPreviousPosition;
    DragNDrop.overlapped = overlapped as any;
    DragNDrop.setOverlapped = setOverlapped as any;
    DragNDrop.hovered = hovered as any;
    DragNDrop.setHovered = setHovered as any;
    DragNDrop.virtualMousePosition = virtualMousePosition;
    DragNDrop.setVirtualMousePosition = setVirtualMousePosition;
    DragNDrop.virtualStartingMousePosition = virtualStartingMousePosition;
    DragNDrop.setVirtualStartingMousePosition = setVirtualStartingMousePosition;
    DragNDrop.virtualCursorDown = virtualCursorDown;
    DragNDrop.setVirtualCursorDown = setVirtualCursorDown;
    DragNDrop.virtualTarget = virtualTarget;
    DragNDrop.setVirtualTarget = setVirtualTarget;
    DragNDrop.virtualPreviousTarget = virtualPreviousTarget;
    DragNDrop.setVirtualPreviousTarget = setVirtualPreviousTarget;
    DragNDrop.virtualPreviousPosition = virtualPreviousPosition;
    DragNDrop.setVirtualPreviousPosition = setVirtualPreviousPosition;
    DragNDrop.virtualOverlapped = virtualOverlapped as any;
    DragNDrop.setVirtualOverlapped = setVirtualOverlapped as any;
    DragNDrop.virtualHovered = virtualHovered as any;
    DragNDrop.setVirtualHovered = setVirtualHovered as any;
    DragNDrop.droppables = droppables;
    DragNDrop.setDropables = setDropables;
    DragNDrop.globalDragStart = globalDragStart;
    DragNDrop.globalDragEnd = globalDragEnd;

    document.addEventListener("pointermove", (e) => {
      //this are general functions, I need to specify them.
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (cursorDown() && target() != null) {
        target().ref.style.transform = `translate(${
          mousePosition().x - startingMousePosition().x + previousPosition().x
        }px, ${
          mousePosition().y - startingMousePosition().y + previousPosition().y
        }px)`;
        target().ref.style.zIndex = 100;
        target().rectangle = target().ref.getBoundingClientRect();
        if (overlapped()?.length > 0) {
          const hoveredDroppable = DragNDrop.findHovered(overlapped()!);
          setHovered(hoveredDroppable as Droppable);
        }
      }
    });
    document.addEventListener("pointerup", (e) => {
      if (target() == null) return;
      globalDragEnd.forEach(async (callback) => {
        callback(e);
      });
      target().dragEnd(hovered());
      if (target()?.ref) {
        target().ref.style.transform = `translate(${0}px, ${0.1}px)`;
        target().ref.style.zIndex = 0;
      }
      setCursorDown(false);
      setPreviousTarget(target() as any);
      setTarget(null as any);
    });

    document.addEventListener("virtualpointermove", (e) => {
      //this are general functions, I need to specify them.
      setVirtualMousePosition({
        x: (e as MouseEvent).clientX,
        y: (e as MouseEvent).clientY,
      });
      if (virtualCursorDown() && virtualTarget()) {
        virtualTarget().ref.style.transform = `translate(${
          virtualMousePosition().x -
          virtualStartingMousePosition().x +
          virtualPreviousPosition().x
        }px, ${
          virtualMousePosition().y -
          virtualStartingMousePosition().y +
          virtualPreviousPosition().y
        }px)`;
        virtualTarget().ref.style.zIndex = 100;
        virtualTarget().rectangle = virtualTarget().ref.getBoundingClientRect();
        if (virtualOverlapped()?.length > 0) {
          setVirtualHovered(
            DragNDrop.virtualFindHovered(virtualOverlapped()) as Droppable
          );
        }
      }
    });
    document.addEventListener("virtualpointerup", (e) => {
      if (virtualTarget() == null) return;
      virtualTarget().dragEnd(virtualHovered());
      globalDragEnd.forEach((callback) => {
        callback(e);
      });
      //   console.log("mouse up");
      // console.log("target", target());
      if (virtualTarget()?.ref) {
        virtualTarget().ref.style.transform = `translate(${0}px, ${0.1}px)`;
        virtualTarget().ref.style.zIndex = 0;
        // console.log(target().ref.style)
      }
      setVirtualCursorDown(false);
      setVirtualPreviousTarget(virtualTarget());
      setVirtualTarget(null as any);
    });
  }

  //injection function
  static onDragStart = (callback: any, draggable: Draggable) => {
    if (draggable !== undefined) {
      draggable.dragStart.push(callback);
    }
  };

  static onGlobalDragStart = (callback: any) => {
    DragNDrop.globalDragStart.push(callback);
  };

  static onGlobalDragEnd = (callback: any) => {
    DragNDrop.globalDragEnd.push(callback);
  };

  //injection function
  static onDragEnd = (callback: Function, draggable: Draggable) => {
    if (draggable !== undefined) {
      draggable.dragEnd = callback;
    }
  };
  //injection function
  static onHoverOver = (callback: Function, droppable: Droppable) => {
    if (droppable !== undefined) {
      droppable.hoverOver = callback;
    }
  };
  static onHoverOut = (callback: Function, droppable: Droppable) => {
    if (droppable !== undefined) {
      droppable.hoverOut = callback;
    }
  };

  private static clearSelection() {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    } else if (document.getSelection) {
      document.getSelection()?.removeAllRanges();
    } else if ((document as any).selection) {
      (document as any).selection.empty();
    }
  }
  private static createDraggableInternal = (id: string) => {
    let draggable: Draggable = {
      id: id,
      startingPosition: { x: 0, y: 0 },
      dragStart: [],
      dragEnd: () => {},
      ref: null,
      rectangle: null,
      data: {},
      init: () => {},
    };

    draggable.init = () => {
      draggable.ref.addEventListener("pointerdown", (e: any) => {
        DragNDrop.clearSelection();
        if (draggable.ref.classList.contains("noDrag")) return;
        DragNDrop.setTarget(draggable);

        for (let i = 0; i < draggable.dragStart.length; i++) {
          draggable.dragStart[i](draggable);
        }
        for (let i = 0; i < DragNDrop.globalDragStart.length; i++) {
          DragNDrop.globalDragStart[i](draggable);
        }
        DragNDrop.setPreviousPosition(
          DragNDrop.getPreviousPosition(e.target.getAttribute("style"))
        );
        DragNDrop.setStartingMousePosition({ x: e.clientX, y: e.clientY });
        DragNDrop.setCursorDown(true);
        // setHovered(draggable.ref.parentElement);
        draggable.rectangle = draggable.ref.getBoundingClientRect();
      });
      //create listener for virtual pointerdown
      draggable.ref.addEventListener("virtualpointerdown", (e: any) => {
        DragNDrop.setVirtualTarget(draggable);
        for (let i = 0; i < draggable.dragStart.length; i++) {
          draggable.dragStart[i](draggable);
        }
        for (let i = 0; i < DragNDrop.globalDragStart.length; i++) {
          DragNDrop.globalDragStart[i](draggable);
        }
        DragNDrop.setVirtualPreviousPosition(
          DragNDrop.getPreviousPosition(e.target.getAttribute("style"))
        );
        DragNDrop.setVirtualStartingMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
        DragNDrop.setVirtualCursorDown(true);
        // setHovered(draggable.ref.parentElement);
        draggable.rectangle = draggable.ref.getBoundingClientRect();
      });
    };

    return draggable;
  };

  public static createDroppable(
    id: string = DragNDrop.generateRandomId(),
    className: string = "droppable"
  ) {
    let droppable = DragNDrop.createDroppableInternal(id);
    let element = document.createElement("div") as unknown as HTMLDivElement;
    element.ref = droppable.ref;
    droppable.ref = element;
    droppable.init();
    element.id = id;
    element.classList.add(className);
    return droppable;
  }

  public static createDraggable(
    id: string = DragNDrop.generateRandomId(),
    className: string = "draggable"
  ) {
    let draggable = DragNDrop.createDraggableInternal(id);
    let element = document.createElement("div") as unknown as HTMLDivElement;
    element.ref = draggable.ref;
    draggable.ref = element;
    draggable.init();
    element.classList.add(className);
    element.id = id;
    return draggable;
  }

  private static generateRandomId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  //what currently happens is that the droppable element detects
  //if there is a target() element and that is has a rectangle propery defined
  //then if that is the case, it then checks if this property overlaps it's own

  //what we need is the draggable to check which elements is it overlapping,
  //and then it needs to send a message to the droppable that it is overlapping the most
  //this is because it can overlap multiple droppables at the same time
  //this is done by checking the area of the overlap, which is just basic math

  //right now we have an event listener in the droppable for pointermove
  //we need the droppable to be able to receive messages from the draggable

  //what we can do is have a global array of droppables that are being hovered,
  //so if there is overlap, we can add it to the array, but that also means if there is not overlap
  //we need to remove from array, and that seems very computationally expensive
  //

  private static createDroppableInternal = (id: string) => {
    let droppable: Droppable = {
      id: id,
      startingPosition: { x: 0, y: 0 },
      hoverOver: () => {},
      hoverOut: () => {},
      ref: null,
      rectangle: null,
      hovering: false,
      occupied: false,
      droppable: true,
      init: () => {},
    };
    //how do we know when something is hovering over?
    //the draggable needs to send a message to the droppable
    DragNDrop.setDropables([...DragNDrop.droppables(), droppable]);

    droppable.init = () => {
      droppable.rectangle = droppable.ref.getBoundingClientRect();
      if (droppable.ref.children.length > 0) {
        droppable.occupied = true;
      }
      document.addEventListener("pointermove", () => {
        if (DragNDrop.target() == null) return;
        if (DragNDrop.target().rectangle == null) return;
        let rect1 = DragNDrop.target().ref.getBoundingClientRect();
        let rect2 = droppable.ref.getBoundingClientRect();
        if (
          rect1.top > rect2.bottom ||
          rect1.right < rect2.left ||
          rect1.bottom < rect2.top ||
          rect1.left > rect2.right
        ) {
          DragNDrop.removeHovered(droppable);
          if (!droppable.hovering) return;
          droppable.hovering = false;
          droppable.hoverOut(DragNDrop.target());
        } else {
          if (droppable.ref === DragNDrop.hovered()?.ref) {
            if (droppable.hovering) return;
            droppable.hovering = true;
            droppable.hoverOver(DragNDrop.target());
          } else {
            droppable.hovering = false;
            droppable.hoverOut(DragNDrop.target());
          }
          DragNDrop.addHovered(droppable);
        }
      });
      document.addEventListener("pointerdown", () => {
        if (DragNDrop.target() == null) return;
        if (DragNDrop.target().rectangle == null) return;
        let rect1 = DragNDrop.target().ref.getBoundingClientRect();
        let rect2 = droppable.ref.getBoundingClientRect();
        if (
          rect1.top > rect2.bottom ||
          rect1.right < rect2.left ||
          rect1.bottom < rect2.top ||
          rect1.left > rect2.right
        ) {
          DragNDrop.removeHovered(droppable);
          if (!droppable.hovering) return;
          droppable.hovering = false;
          droppable.hoverOut(DragNDrop.target());
        } else {
          if (droppable.ref === DragNDrop.hovered()?.ref) {
            if (droppable.hovering) return;
            droppable.hovering = true;
            droppable.hoverOver(DragNDrop.target());
          } else {
            droppable.hovering = false;
            droppable.hoverOut(DragNDrop.target());
          }
          DragNDrop.addHovered(droppable);
        }

        const overlapped = DragNDrop.overlapped();
        if (overlapped && overlapped.length > 0) {
          const hovered = DragNDrop.findHovered(overlapped);
          if (hovered) {
            DragNDrop.setHovered(hovered);
          }
        }
      });
      document.addEventListener("pointerup", () => {
        if (droppable.ref.children.length === 0) {
          droppable.occupied = false;
        }
        if (droppable.ref.children.length > 0) {
          droppable.occupied = true;
        }
        if (!droppable.hovering) return;
        droppable.hovering = false;
        droppable.hoverOut(DragNDrop.previousTarget());
        if (DragNDrop.previousTarget() == null) return;
        // if(droppable.occupied) return;
        if (droppable.droppable === false) return;

        // droppable.ref.removeChild(droppable.ref.children[0]);

        droppable.ref.appendChild(DragNDrop.previousTarget().ref);
      });

      document.addEventListener("virtualpointermove", () => {
        if (DragNDrop.virtualTarget() == null) return;
        if (DragNDrop.virtualTarget().rectangle == null) return;
        let rect1 = DragNDrop.virtualTarget().ref.getBoundingClientRect();
        let rect2 = droppable.ref.getBoundingClientRect();
        if (
          rect1.top > rect2.bottom ||
          rect1.right < rect2.left ||
          rect1.bottom < rect2.top ||
          rect1.left > rect2.right
        ) {
          DragNDrop.virtualRemoveHovered(droppable);
          if (!droppable.hovering) return;
          droppable.hovering = false;
          droppable.hoverOut(DragNDrop.virtualTarget());
        } else {
          if (droppable.ref === DragNDrop.virtualHovered()?.ref) {
            if (droppable.hovering) return;
            droppable.hovering = true;
            droppable.hoverOver(DragNDrop.virtualTarget());
          } else {
            droppable.hovering = false;
            droppable.hoverOut(DragNDrop.virtualTarget());
          }
          DragNDrop.virtualAddHovered(droppable);
          // for (let i=0; i < virtualHovered().length; i++){
          //   console.log(virtualHovered())
          // }
        }
      });
      document.addEventListener("virtualpointerdown", () => {
        if (DragNDrop.virtualTarget() == null) return;
        if (DragNDrop.virtualTarget().rectangle == null) return;
        let rect1 = DragNDrop.virtualTarget().ref.getBoundingClientRect();
        let rect2 = droppable.ref.getBoundingClientRect();
        if (
          rect1.top > rect2.bottom ||
          rect1.right < rect2.left ||
          rect1.bottom < rect2.top ||
          rect1.left > rect2.right
        ) {
          DragNDrop.virtualRemoveHovered(droppable);
          if (!droppable.hovering) return;
          droppable.hovering = false;
          droppable.hoverOut(DragNDrop.virtualTarget());
        } else {
          if (droppable.ref === DragNDrop.virtualHovered()?.ref) {
            if (droppable.hovering) return;
            droppable.hovering = true;
            droppable.hoverOver(DragNDrop.virtualTarget());
          } else {
            droppable.hovering = false;
            droppable.hoverOut(DragNDrop.virtualTarget());
          }
          DragNDrop.virtualAddHovered(droppable);
        }

        const virtualOverlapped = DragNDrop.virtualOverlapped();
        if (virtualOverlapped && virtualOverlapped.length > 0) {
          const hovered = DragNDrop.virtualFindHovered(virtualOverlapped);
          if (hovered) {
            DragNDrop.setVirtualHovered(hovered);
          }
        }
      });
      //DOUBLE CHECKED
      document.addEventListener("virtualpointerup", () => {
        // if(droppable.ref.children.length === 0){
        //   droppable.occupied = false;
        // }
        // if(droppable.ref.children.length > 0){
        //   droppable.occupied = true;
        // }
        if (!droppable.hovering) return;
        droppable.hovering = false;
        droppable.hoverOut(DragNDrop.virtualPreviousTarget());
        // console.log("hi")
        if (DragNDrop.virtualPreviousTarget() == null) return;
        // if(droppable.occupied) return;
        if (droppable.droppable === false) return;

        // console.log("removed something");
        //also modified for chess
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (droppable.ref.querySelector(".piece") !== null) {
          //right here I am removing the children, if the droppable is occupied
          //what I need to do it take this child and send it back to the event
          droppable.ref.querySelector(".piece").remove();
          // console.log("PIECE REMOVED")
        } else if (droppable.ref.querySelector(".circle") !== null) {
          droppable.ref.querySelector(".circle").remove();
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //in a regular program I would just remove the only child, but the board square has
        //numbers and letters that mess this up, so I must specify the child types to remove

        droppable.ref.appendChild(DragNDrop.virtualPreviousTarget().ref);
      });
    };
    return DragNDrop.droppables()[DragNDrop.droppables().length - 1];
  };

  //universal
  public static getPreviousPosition(style: string) {
    if (style === null) return { x: 0, y: 0 };
    let ass = style.split("translate(")[0];
    let position;
    if (ass) {
      position = style.split("translate(")[1]?.split(")")[0]?.split("px, ");
    }
    return {
      x: parseInt(position?.[0] ?? "0"),
      y: parseInt(position?.[1] ?? "0"),
    };
  }

  public static addHovered(droppable: Droppable) {
    if (DragNDrop.overlapped() == null) DragNDrop.setOverlapped([droppable]);
    if (DragNDrop.overlapped().includes(droppable)) return;
    if (!DragNDrop.overlapped()?.includes(droppable))
      DragNDrop.setOverlapped([...DragNDrop.overlapped(), droppable]);
  }

  public static removeHovered(droppable: Droppable) {
    if (DragNDrop.overlapped() == null) return;
    if (!DragNDrop.overlapped()?.includes(droppable)) return;
    if (DragNDrop.overlapped().includes(droppable))
      DragNDrop.setOverlapped(
        DragNDrop.overlapped()?.filter((d) => d !== droppable)
      );
  }

  public static findHovered(overlapped: Droppable[]) {
    if (overlapped == null) return;
    let targetRect = DragNDrop.target().ref.getBoundingClientRect();
    let hovered = overlapped.sort((a, b) => {
      //we are given two rectangles, we must compare with target()
      //and return same but calculate correctly
      let arect = a.ref.getBoundingClientRect();
      let brect = b.ref.getBoundingClientRect();
      let awidht;
      let aheight;
      let bwidth;
      let bheight;
      let areaA;
      let areaB;

      //bottom is actually top, need to reverse y coords
      if (targetRect.x > arect.x) {
        awidht = arect.right - targetRect.x;
      } else {
        awidht = targetRect.right - arect.x;
      }
      if (targetRect.bottom > arect.bottom) {
        aheight = arect.bottom - targetRect.top;
      } else {
        aheight = targetRect.bottom - arect.top;
      }
      areaA = awidht * aheight;

      if (targetRect.x > brect.x) {
        bwidth = brect.right - targetRect.x;
      } else {
        bwidth = targetRect.right - brect.x;
      }
      if (targetRect.bottom > brect.bottom) {
        bheight = brect.bottom - targetRect.top;
      } else {
        bheight = targetRect.bottom - brect.top;
      }

      areaB = bwidth * bheight;

      return areaB - areaA;
    });

    return hovered[0];
  }

  public static virtualAddHovered(droppable: Droppable) {
    if (DragNDrop.virtualOverlapped() == null)
      DragNDrop.setVirtualOverlapped([droppable]);
    if (DragNDrop.virtualOverlapped().includes(droppable)) return;
    if (!DragNDrop.virtualOverlapped()?.includes(droppable))
      DragNDrop.setVirtualOverlapped([
        ...DragNDrop.virtualOverlapped(),
        droppable,
      ]);
  }

  public static virtualRemoveHovered(droppable: Droppable) {
    if (DragNDrop.virtualOverlapped() == null) return;
    if (DragNDrop.virtualOverlapped()?.includes(droppable)) return;
    if (DragNDrop.virtualOverlapped().includes(droppable))
      DragNDrop.setVirtualOverlapped(
        DragNDrop.virtualOverlapped()?.filter((d) => d !== droppable)
      );
  }

  public static virtualFindHovered(overlapped: Droppable[]) {
    if (overlapped == null) return;
    let targetRect = DragNDrop.virtualTarget().ref.getBoundingClientRect();
    let hovered = overlapped.sort((a, b) => {
      //we are given two rectangles, we must compare with target()
      //and return same but calculate correctly
      let arect = a.ref.getBoundingClientRect();
      let brect = b.ref.getBoundingClientRect();
      let awidht;
      let aheight;
      let bwidth;
      let bheight;
      let areaA;
      let areaB;

      //bottom is actually top, need to reverse y coords
      if (targetRect.x > arect.x) {
        awidht = arect.right - targetRect.x;
      } else {
        awidht = targetRect.right - arect.x;
      }
      if (targetRect.bottom > arect.bottom) {
        aheight = arect.bottom - targetRect.top;
      } else {
        aheight = targetRect.bottom - arect.top;
      }
      areaA = awidht * aheight;

      if (targetRect.x > brect.x) {
        bwidth = brect.right - targetRect.x;
      } else {
        bwidth = targetRect.right - brect.x;
      }
      if (targetRect.bottom > brect.bottom) {
        bheight = brect.bottom - targetRect.top;
      } else {
        bheight = targetRect.bottom - brect.top;
      }

      areaB = bwidth * bheight;

      return areaB - areaA;
    });

    return hovered[0];
  }
}
