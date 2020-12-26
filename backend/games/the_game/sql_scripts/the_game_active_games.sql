create table the_game_active_games
(
	id uuid default uuid_generate_v4() not null,
	creation_date time default now() not null,
	n_actions int default 1,
	current_player_index integer,
	player_list json,
	pile_list json,
	remaining_cards integer not null,
	on_fire boolean not null,
	turn integer default 0 not null,
	deck_size integer not null,
	min_to_play_cards integer not null
);

alter table the_game_active_games owner to admin;

create unique index the_game_active_games_id_uindex
	on the_game_active_games (id);

