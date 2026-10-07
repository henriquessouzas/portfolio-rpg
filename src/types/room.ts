export type RoomKey = 'armory' | 'lab' | 'library' | 'quarters' | 'throne';

export type RoomObject = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  emoji?: string;
};

export type Room = {
  key: RoomKey;
  name: string;
  colorToken: string;
  objects: RoomObject[];
};
