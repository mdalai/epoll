export interface Poll {
  id: string;
  title: string;
  options: PollOption[];
  status: 'active' | 'paused';
  settings: {
    allowMultipleVotes: boolean;
    allowVoteChange: boolean;
  };
}

export interface PollOption {
  name: string;
  votes: number;
  voters?: string[];
}


export interface Vote {
  id: string;
  pollId: string;
  userId: string;
  option: string;
}