<?php

namespace Tests\Feature;

use App\Models\CaseAssignment;
use App\Models\CauseListEntry;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Message;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class NotificationBadgeTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_includes_notification_counts(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $conversation = Conversation::factory()->create([
            'created_by_id' => $other->id,
        ]);
        ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user->id,
        ]);
        ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $other->id,
        ]);
        Message::factory()->create([
            'conversation_id' => $conversation->id,
            'sender_id' => $other->id,
        ]);

        $report = Report::factory()->create([
            'submitted_by_id' => $other->id,
        ]);
        $report->sharedWith()->sync([$user->id]);

        CaseAssignment::factory()->create([
            'user_id' => $user->id,
        ]);

        CauseListEntry::factory()->create([
            'assigned_lawyer_id' => $user->id,
            'date' => now()->toDateString(),
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('notifications.total', 4)
            ->where('notifications.messages', 1)
            ->where('notifications.shared_reports', 1)
            ->where('notifications.case_assignments', 1)
            ->where('notifications.cause_list', 1));
    }
}
