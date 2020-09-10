create table users
(
	name text not null
		constraint users_pk
			primary key,
	password text not null,
	token uuid,
	last_received_update date default now() not null
);

comment on table users is 'this table cotains information relative to user connection such as username password and token';

alter table users owner to admin;

create unique index users_name_uindex
	on users (name);

