create table if not exists users
(
	name text not null
		constraint users_pk
			primary key,
	password text not null,
	token uuid
);

comment on table users is 'this table cotains information relative to user connection such as username password and token';

alter table users owner to admin;

create unique index if not exists users_name_uindex
	on users (name);

