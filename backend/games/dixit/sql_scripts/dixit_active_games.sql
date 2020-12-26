create table dixit_active_games
(
	id uuid default uuid_generate_v4() not null,
	creation_date time default now(),
	n_actions int default 1,
	current_player_index integer default 0,
	player_list json,
	n_cards integer not null,
	total_points integer not null,
	image_set text not null,
	card_description text,
	played_cards json
);

alter table dixit_active_games owner to admin;

create unique index dixit_active_games_id_uindex
	on dixit_active_games (id);

