create table catan_active_games
(
	id uuid default uuid_generate_v4() not null,
	creation_date time default now() not null,
	last_updated time default now() not null,
	current_player_index integer default 0 not null,
	player_list json not null,
	play_list json not null,
	turn_index integer default 0 not null,
	development_deck json,
	materials_deck json,
	land_list json not null,
	offer json,
	extended boolean default false not null,
	knight_player json,
	long_road_player json,
	discard_cards boolean default false not null,
	thief_moved boolean default true not null,
	last_dice_result integer,
	to_build_roads integer default 0 not null,
	thief_position integer,
	to_steal_players json
);

alter table catan_active_games owner to admin;

