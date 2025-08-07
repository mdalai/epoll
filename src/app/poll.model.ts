export interface Poll {
  id: string;
  title: string;
  options: string[];
  status: 'active' | 'paused';
  settings: {
    allowMultipleVotes: boolean;
    allowVoteChange: boolean;
  };
}

export interface Vote {
  id: string;
  pollId: string;
  userId: string;
  option: string;
}