export interface Dataset {
  id: string;
  title: string;
  category: string;
  categoryEmoji: string;
  description: string;
  hours: number;
  taskCount: number;
  priceRange: string;
  pricePerHour: number;
  tasks: string[];
  totalRecordings: number;
  uniqueEnvironments: number;
  avgDuration: string;
  contributors: number;
  volumeDiscounts: { hours: string; discount: string; rate: string }[];
  annotations: {
    handPose: boolean;
    handMesh: boolean;
    objectDetection: boolean;
    graspClassification: boolean;
    actionSegmentation: boolean;
    sceneDescription: boolean;
  };
  sampleSchema: string;
}

export const categories = [
  { id: "kitchen", name: "Kitchen", emoji: "🍳" },
  { id: "cleaning", name: "Cleaning", emoji: "🧹" },
  { id: "organization", name: "Organization", emoji: "📦" },
  { id: "assembly", name: "Assembly", emoji: "🔧" },
  { id: "personal-care", name: "Personal Care", emoji: "✋" },
  { id: "office", name: "Office", emoji: "🖊️" },
];

export const dataTypes = [
  { id: "hand-pose", name: "Hand Pose" },
  { id: "3d-mesh", name: "3D Mesh" },
  { id: "object-detection", name: "Object Detection" },
  { id: "action-segmentation", name: "Action Segmentation" },
];

export const formats = ["All", "RLDS", "LeRobot", "HDF5"];

export const datasets: Dataset[] = [
  {
    id: "kitchen-manipulation",
    title: "Kitchen Manipulation",
    category: "kitchen",
    categoryEmoji: "🍳",
    description:
      "Comprehensive kitchen task recordings including pouring, stirring, cutting, plating, and utensil handling. Captured in real home kitchens across diverse environments with varied cookware, ingredients, and counter setups.",
    hours: 2500,
    taskCount: 5,
    priceRange: "$49-199/hr",
    pricePerHour: 99,
    tasks: ["Pouring liquids", "Stirring & mixing", "Cutting & chopping", "Plating food", "Utensil handling"],
    totalRecordings: 45000,
    uniqueEnvironments: 3200,
    avgDuration: "3.3 min",
    contributors: 1800,
    volumeDiscounts: [
      { hours: "1-100", discount: "Standard", rate: "$99/hr" },
      { hours: "100-500", discount: "10% off", rate: "$89/hr" },
      { hours: "500-1000", discount: "20% off", rate: "$79/hr" },
      { hours: "1000+", discount: "30% off", rate: "$69/hr" },
    ],
    annotations: {
      handPose: true,
      handMesh: true,
      objectDetection: true,
      graspClassification: true,
      actionSegmentation: true,
      sceneDescription: true,
    },
    sampleSchema: `{
  "recording_id": "rec_k_00042391",
  "task": "pouring_liquid",
  "duration_sec": 12.4,
  "fps": 30,
  "frames": 372,
  "hand_pose": {
    "keypoints": 21,
    "format": "mediapipe_hand",
    "confidence_avg": 0.94
  },
  "hand_mesh": {
    "model": "MANO",
    "params_per_frame": 61
  },
  "objects": [
    { "class": "kettle", "track_id": 1, "bbox_format": "xyxy" },
    { "class": "mug", "track_id": 2, "bbox_format": "xyxy" }
  ],
  "grasp_type": "cylindrical",
  "action_segments": [
    { "label": "reach", "start": 0.0, "end": 2.1 },
    { "label": "grasp", "start": 2.1, "end": 3.4 },
    { "label": "pour", "start": 3.4, "end": 9.8 },
    { "label": "place", "start": 9.8, "end": 12.4 }
  ],
  "scene": "Modern kitchen, granite counter, morning light",
  "environment_id": "env_3291"
}`,
  },
  {
    id: "cleaning-folding",
    title: "Cleaning & Folding",
    category: "cleaning",
    categoryEmoji: "🧹",
    description:
      "Everyday cleaning and laundry tasks including wiping surfaces, folding clothes, sweeping, and organizing cleaning supplies. Recorded across bedrooms, living rooms, and laundry areas.",
    hours: 1800,
    taskCount: 4,
    priceRange: "$49-199/hr",
    pricePerHour: 89,
    tasks: ["Wiping surfaces", "Folding clothes", "Sweeping & mopping", "Organizing supplies"],
    totalRecordings: 32000,
    uniqueEnvironments: 2800,
    avgDuration: "3.4 min",
    contributors: 1500,
    volumeDiscounts: [
      { hours: "1-100", discount: "Standard", rate: "$89/hr" },
      { hours: "100-500", discount: "10% off", rate: "$80/hr" },
      { hours: "500-1000", discount: "20% off", rate: "$71/hr" },
      { hours: "1000+", discount: "30% off", rate: "$62/hr" },
    ],
    annotations: {
      handPose: true,
      handMesh: true,
      objectDetection: true,
      graspClassification: true,
      actionSegmentation: true,
      sceneDescription: true,
    },
    sampleSchema: `{
  "recording_id": "rec_c_00018742",
  "task": "folding_tshirt",
  "duration_sec": 28.6,
  "fps": 30,
  "frames": 858,
  "hand_pose": {
    "keypoints": 21,
    "format": "mediapipe_hand",
    "confidence_avg": 0.91
  },
  "objects": [
    { "class": "tshirt", "track_id": 1, "bbox_format": "xyxy" }
  ],
  "grasp_type": "pinch",
  "action_segments": [
    { "label": "spread", "start": 0.0, "end": 5.2 },
    { "label": "fold_horizontal", "start": 5.2, "end": 14.1 },
    { "label": "fold_vertical", "start": 14.1, "end": 22.8 },
    { "label": "smooth", "start": 22.8, "end": 28.6 }
  ],
  "scene": "Bedroom, queen bed, natural light"
}`,
  },
  {
    id: "assembly-tools",
    title: "Assembly & Tools",
    category: "assembly",
    categoryEmoji: "🔧",
    description:
      "Tool usage and assembly tasks including screwing, hammering, measuring, and component fitting. Covers furniture assembly, electronics repair, and general DIY activities in home workshops and garages.",
    hours: 900,
    taskCount: 3,
    priceRange: "$79-249/hr",
    pricePerHour: 129,
    tasks: ["Screw driving", "Component fitting", "Measuring & marking"],
    totalRecordings: 16000,
    uniqueEnvironments: 1200,
    avgDuration: "3.4 min",
    contributors: 800,
    volumeDiscounts: [
      { hours: "1-100", discount: "Standard", rate: "$129/hr" },
      { hours: "100-500", discount: "10% off", rate: "$116/hr" },
      { hours: "500+", discount: "20% off", rate: "$103/hr" },
    ],
    annotations: {
      handPose: true,
      handMesh: true,
      objectDetection: true,
      graspClassification: true,
      actionSegmentation: true,
      sceneDescription: true,
    },
    sampleSchema: `{
  "recording_id": "rec_a_00007821",
  "task": "screwdriving",
  "duration_sec": 18.2,
  "fps": 30,
  "frames": 546,
  "hand_pose": {
    "keypoints": 21,
    "format": "mediapipe_hand",
    "confidence_avg": 0.89
  },
  "objects": [
    { "class": "screwdriver", "track_id": 1 },
    { "class": "screw", "track_id": 2 },
    { "class": "wood_panel", "track_id": 3 }
  ],
  "grasp_type": "cylindrical",
  "action_segments": [
    { "label": "pick_screw", "start": 0.0, "end": 3.1 },
    { "label": "position", "start": 3.1, "end": 6.4 },
    { "label": "drive", "start": 6.4, "end": 18.2 }
  ]
}`,
  },
  {
    id: "fine-motor-skills",
    title: "Fine Motor Skills",
    category: "personal-care",
    categoryEmoji: "✋",
    description:
      "Precision manipulation tasks requiring fine motor control: buttoning, zipping, tying, threading needles, and handling small objects. Essential for dexterous robotic manipulation research.",
    hours: 1200,
    taskCount: 3,
    priceRange: "$79-249/hr",
    pricePerHour: 139,
    tasks: ["Buttoning & zipping", "Tying knots & bows", "Threading & precision placement"],
    totalRecordings: 21000,
    uniqueEnvironments: 1900,
    avgDuration: "3.4 min",
    contributors: 1100,
    volumeDiscounts: [
      { hours: "1-100", discount: "Standard", rate: "$139/hr" },
      { hours: "100-500", discount: "10% off", rate: "$125/hr" },
      { hours: "500+", discount: "20% off", rate: "$111/hr" },
    ],
    annotations: {
      handPose: true,
      handMesh: true,
      objectDetection: true,
      graspClassification: true,
      actionSegmentation: true,
      sceneDescription: true,
    },
    sampleSchema: `{
  "recording_id": "rec_f_00012034",
  "task": "buttoning_shirt",
  "duration_sec": 8.7,
  "fps": 30,
  "frames": 261,
  "hand_pose": {
    "keypoints": 21,
    "format": "mediapipe_hand",
    "confidence_avg": 0.92
  },
  "objects": [
    { "class": "button", "track_id": 1 },
    { "class": "shirt_fabric", "track_id": 2 }
  ],
  "grasp_type": "pinch",
  "action_segments": [
    { "label": "align", "start": 0.0, "end": 2.8 },
    { "label": "insert", "start": 2.8, "end": 5.9 },
    { "label": "push_through", "start": 5.9, "end": 8.7 }
  ]
}`,
  },
  {
    id: "object-organization",
    title: "Object Organization",
    category: "organization",
    categoryEmoji: "📦",
    description:
      "Sorting, stacking, shelving, and general object rearrangement tasks. Covers pantry organization, closet sorting, desk tidying, and bin packing across diverse home environments.",
    hours: 800,
    taskCount: 3,
    priceRange: "$49-199/hr",
    pricePerHour: 79,
    tasks: ["Sorting & categorizing", "Stacking & shelving", "Bin packing"],
    totalRecordings: 14000,
    uniqueEnvironments: 1100,
    avgDuration: "3.4 min",
    contributors: 700,
    volumeDiscounts: [
      { hours: "1-100", discount: "Standard", rate: "$79/hr" },
      { hours: "100-500", discount: "10% off", rate: "$71/hr" },
      { hours: "500+", discount: "20% off", rate: "$63/hr" },
    ],
    annotations: {
      handPose: true,
      handMesh: true,
      objectDetection: true,
      graspClassification: true,
      actionSegmentation: true,
      sceneDescription: true,
    },
    sampleSchema: `{
  "recording_id": "rec_o_00009281",
  "task": "shelf_organization",
  "duration_sec": 45.3,
  "fps": 30,
  "frames": 1359,
  "hand_pose": {
    "keypoints": 21,
    "format": "mediapipe_hand",
    "confidence_avg": 0.90
  },
  "objects": [
    { "class": "book", "track_id": 1 },
    { "class": "book", "track_id": 2 },
    { "class": "box", "track_id": 3 }
  ],
  "grasp_type": "lateral_pinch",
  "action_segments": [
    { "label": "pick", "start": 0.0, "end": 3.2 },
    { "label": "transport", "start": 3.2, "end": 8.1 },
    { "label": "place", "start": 8.1, "end": 12.4 }
  ]
}`,
  },
  {
    id: "office-manipulation",
    title: "Office Manipulation",
    category: "office",
    categoryEmoji: "🖊️",
    description:
      "Office-related manipulation tasks including writing, typing, filing, stapling, and paper handling. Recorded in home offices and co-working spaces with standard office equipment.",
    hours: 400,
    taskCount: 2,
    priceRange: "$39-149/hr",
    pricePerHour: 69,
    tasks: ["Writing & paper handling", "Filing & stapling"],
    totalRecordings: 7000,
    uniqueEnvironments: 600,
    avgDuration: "3.4 min",
    contributors: 400,
    volumeDiscounts: [
      { hours: "1-100", discount: "Standard", rate: "$69/hr" },
      { hours: "100-500", discount: "10% off", rate: "$62/hr" },
      { hours: "500+", discount: "20% off", rate: "$55/hr" },
    ],
    annotations: {
      handPose: true,
      handMesh: true,
      objectDetection: true,
      graspClassification: true,
      actionSegmentation: true,
      sceneDescription: true,
    },
    sampleSchema: `{
  "recording_id": "rec_off_00003421",
  "task": "paper_filing",
  "duration_sec": 22.1,
  "fps": 30,
  "frames": 663,
  "hand_pose": {
    "keypoints": 21,
    "format": "mediapipe_hand",
    "confidence_avg": 0.93
  },
  "objects": [
    { "class": "paper_stack", "track_id": 1 },
    { "class": "folder", "track_id": 2 },
    { "class": "stapler", "track_id": 3 }
  ],
  "grasp_type": "lateral_pinch",
  "action_segments": [
    { "label": "gather", "start": 0.0, "end": 5.4 },
    { "label": "align", "start": 5.4, "end": 10.2 },
    { "label": "staple", "start": 10.2, "end": 14.8 },
    { "label": "file", "start": 14.8, "end": 22.1 }
  ]
}`,
  },
];

export function getDataset(id: string): Dataset | undefined {
  return datasets.find((d) => d.id === id);
}

export function getDatasetsByCategory(category: string): Dataset[] {
  if (category === "all") return datasets;
  return datasets.filter((d) => d.category === category);
}
