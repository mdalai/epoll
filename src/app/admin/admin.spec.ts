import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin';
import { PollService } from '../poll';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Poll } from '../poll.model';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let pollService: jasmine.SpyObj<PollService>;

  beforeEach(async () => {
    const pollServiceSpy = jasmine.createSpyObj('PollService', ['getPolls', 'updatePollStatus']);

    await TestBed.configureTestingModule({
      imports: [AdminComponent, NoopAnimationsModule],
      providers: [{ provide: PollService, useValue: pollServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    pollService = TestBed.inject(PollService) as jasmine.SpyObj<PollService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update poll status', () => {
    const initialPolls: Poll[] = [
      { id: '1', title: 'Poll 1', options: ['A', 'B'], status: 'active', settings: { allowMultipleVotes: false, allowVoteChange: false } },
      { id: '2', title: 'Poll 2', options: ['C', 'D'], status: 'active', settings: { allowMultipleVotes: false, allowVoteChange: false } }
    ];
    component.polls.set(initialPolls);

    pollService.updatePollStatus.and.returnValue(of(undefined));

    const pollToUpdate = initialPolls[0];
    const newStatus = 'paused' as const;
    component.updatePollStatus(pollToUpdate, newStatus);

    expect(pollService.updatePollStatus).toHaveBeenCalledWith(pollToUpdate.id, newStatus);

    const updatedPolls = component.polls();
    expect(updatedPolls[0].status).toBe(newStatus);
    expect(updatedPolls[1].status).toBe('active');
  });
});