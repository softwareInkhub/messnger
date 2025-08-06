import { useState } from "react";
import Icon from "common/components/icons";
import { useMessaging } from "../../../hooks/useMessaging";
import { useChatContext } from "../../../context/chat";
import {
  AttachButton,
  Button,
  ButtonsContainer,
  IconsWrapper,
  Input,
  SendMessageButton,
  Wrapper,
} from "./styles";

const attachButtons = [
  { icon: "attachRooms", label: "Choose room" },
  { icon: "attachContacts", label: "Choose contact" },
  { icon: "attachDocument", label: "Choose document" },
  { icon: "attachCamera", label: "Use camera" },
  { icon: "attachImage", label: "Choose image" },
];

export default function Footer() {
  const [showIcons, setShowIcons] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const { user, activeChat } = useChatContext();
  const { sendMessage, isConnected } = useMessaging(user.id, activeChat?.id || "");

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChat || isSending || !isConnected) return;

    setIsSending(true);
    try {
      await sendMessage(messageText.trim());
      setMessageText(""); // Clear input after successful send
    } catch (error) {
      console.error("Failed to send message:", error);
      // You could show a toast notification here
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Wrapper>
      <IconsWrapper>
        <AttachButton onClick={() => setShowIcons(!showIcons)}>
          <Icon id="attach" className="icon" />
        </AttachButton>
        <ButtonsContainer>
          {attachButtons.map((btn) => (
            <Button showIcon={showIcons} key={btn.label}>
              <Icon id={btn.icon} />
            </Button>
          ))}
        </ButtonsContainer>
      </IconsWrapper>
      <Input 
        placeholder={
          !isConnected 
            ? "Backend disconnected..." 
            : !activeChat 
              ? "Select a chat to send messages"
              : "Type a message here .."
        }
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={!isConnected || !activeChat || isSending}
      />
      <SendMessageButton 
        onClick={handleSendMessage}
        disabled={!messageText.trim() || !activeChat || isSending || !isConnected}
        style={{
          opacity: (!messageText.trim() || !activeChat || isSending || !isConnected) ? 0.5 : 1,
          cursor: (!messageText.trim() || !activeChat || isSending || !isConnected) ? 'not-allowed' : 'pointer'
        }}
      >
        <Icon id={isSending ? "loading" : "send"} className="icon" />
      </SendMessageButton>
    </Wrapper>
  );
}
