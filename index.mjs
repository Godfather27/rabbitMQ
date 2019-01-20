"use strict";

import Pipe from "./pipe.mjs";
import Filter from "./filter.mjs";

class AddA extends Filter {
  process(message) {
    return message + "A"
  }
}

class AddB extends Filter {
  process(message) {
    return message + "B"
  }
}

class AddC extends Filter {
  process(message) {
    return message + "C"
  }
}

const testPipe = new Pipe({
  pipeName: "test",
  filters: [
    new AddA({ filterName: "addA" }),
    new AddB({ filterName: "addB" }),
    new AddC({ filterName: "addC" }),
  ]
});

testPipe.start("easy as ");