import { AbilityBuilder, createMongoAbility } from "@casl/ability";

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  avatar: string;
}

const defineAbilityFor = (user: UserInterface) => {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  if (user.isAdmin) {
    can("manage", "all"); // read-write access to everything
  } else {
    can("read", "all"); // read-only access to everything
    can("like", "post"); // can like posts
  }

  return build();
};

export { defineAbilityFor };
