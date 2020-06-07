create table if not exists tic_tac_toe_active_games
(
	id uuid default uuid_generate_v4() not null,
	creation_date time default now() not null,
	last_updated time default now() not null,
	rows integer not null,
	cols integer not null,
	current_player_index integer default 0 not null,
	players json not null,
	plays json not null,
	gravity boolean default false not null
);

alter table tic_tac_toe_active_games owner to admin;

