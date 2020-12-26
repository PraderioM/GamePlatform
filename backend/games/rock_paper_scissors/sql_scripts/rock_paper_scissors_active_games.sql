create table rock_paper_scissors_active_games
(
	id uuid default uuid_generate_v4() not null,
	creation_date time default now() not null,
	n_actions int default 1,
	player_list json,
	current_round integer default 0 not null,
	victory_criterion text default 'by_play'::text not null,
	n_plays integer default 3 not null,
	total_points integer,
	play_mode text default 'classic'::text not null
);

alter table rock_paper_scissors_active_games owner to admin;

