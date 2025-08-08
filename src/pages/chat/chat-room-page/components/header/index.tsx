import Icon from "common/components/icons";
import OptionsMenu from "pages/chat/components/option-menu";
import { useAuth } from "context/AuthContext";
import {
  Action,
  Actions,
  actionStyles,
  Avatar,
  AvatarWrapper,
  Container,
  Name,
  ProfileWrapper,
  Subtitle,
} from "./styles";

type HeaderProps = {
  onSearchClick: Function;
  onProfileClick: Function;
  title: string;
  image: string;
  subTitle: string;
};

export default function Header(props: HeaderProps) {
  const { title, subTitle, image, onProfileClick, onSearchClick } = props;
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Container>
      <AvatarWrapper>
        <Avatar src={image} />
      </AvatarWrapper>
      <ProfileWrapper onClick={onProfileClick}>
        <Name>{title}</Name>
        {subTitle && <Subtitle>{subTitle}</Subtitle>}
        {user && <Subtitle>Logged in as: {user.username}</Subtitle>}
      </ProfileWrapper>
      <Actions>
        <Action onClick={onSearchClick}>
          <Icon id="search" className="icon search-icon" />
        </Action>
        <Action onClick={handleLogout} title="Logout">
          <Icon id="logout" className="icon logout-icon" />
        </Action>
        <OptionsMenu
          styles={actionStyles}
          ariaLabel="Menu"
          iconId="menu"
          iconClassName="icon"
          options={[
            "Contact Info",
            "Select Messages",
            "Mute notifications",
            "Clear messages",
            "Delete chat",
          ]}
        />
      </Actions>
    </Container>
  );
}
