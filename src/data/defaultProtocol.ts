import type { Experiment } from "../types";

export const OBJECT_TAGS = [
  "RED BOX",
  "YELLOW BOX",
  "EXPERIMENT CONTAINER",
  "TARGET AREA",
] as const;

export const INTERACTION_TAGS = [
  "PICK UP",
  "PLACE",
  "OPEN",
  "CLOSE",
  "IDENTIFY",
] as const;

export const defaultExperiment: Experiment = {
  id: "BAS-EXP-01",
  name: "Object Sorting",
  description:
    "Astronaut sorts colour-coded payload samples from the experiment container into the designated target area, in a fixed procedural sequence, while the onboard AI observes, validates and logs each action.",
  steps: [
    {
      id: "s1",
      index: 0,
      action: "Open container",
      requiredObject: "EXPERIMENT CONTAINER",
      interaction: "OPEN",
      confidenceThreshold: 85,
      voiceInstruction: "Open the experiment container to begin.",
      verifiedLine: "Container opened and confirmed.",
    },
    {
      id: "s2",
      index: 1,
      action: "Identify red box",
      requiredObject: "RED BOX",
      interaction: "IDENTIFY",
      confidenceThreshold: 85,
      voiceInstruction: "Locate and identify the red box inside the container.",
      verifiedLine: "Red box identified.",
    },
    {
      id: "s3",
      index: 2,
      action: "Pick up red box",
      requiredObject: "RED BOX",
      interaction: "PICK UP",
      confidenceThreshold: 88,
      voiceInstruction: "Pick up the red box.",
      verifiedLine: "Red box picked up successfully.",
    },
    {
      id: "s4",
      index: 3,
      action: "Place red box",
      requiredObject: "RED BOX",
      interaction: "PLACE",
      confidenceThreshold: 88,
      voiceInstruction: "Place the red box in the target area.",
      verifiedLine: "Red box detected and placed.",
    },
    {
      id: "s5",
      index: 4,
      action: "Pick up yellow box",
      requiredObject: "YELLOW BOX",
      interaction: "PICK UP",
      confidenceThreshold: 88,
      voiceInstruction: "Pick up the yellow box.",
      verifiedLine: "Yellow box picked up successfully.",
    },
    {
      id: "s6",
      index: 5,
      action: "Place yellow box",
      requiredObject: "YELLOW BOX",
      interaction: "PLACE",
      confidenceThreshold: 88,
      voiceInstruction: "Place the yellow box in the target area.",
      verifiedLine: "Yellow box detected and placed.",
    },
    {
      id: "s7",
      index: 6,
      action: "Close container",
      requiredObject: "EXPERIMENT CONTAINER",
      interaction: "CLOSE",
      confidenceThreshold: 85,
      voiceInstruction: "Close the experiment container to complete the sequence.",
      verifiedLine: "Container closed. Experiment sequence complete.",
    },
  ],
};
