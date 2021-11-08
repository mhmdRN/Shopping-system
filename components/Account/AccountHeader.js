import {Segment, Header, Label, Icon} from 'semantic-ui-react'
import formatDate from '../../utils/formatDate';
function AccountHeader({role,name,email,createdAt}) {
  return (
  <Segment color="violet" secondary inverted>
    <Label
      color="teal"
      size="large"
      ribbon
      icon="privacy"
      style={{ textTransform: 'capitalize'}}
      content={role}
    />
  <Header inverted textAlign="center" as="h1" icon>
    <Icon name="user"/>
    {name}
    <Header.Subheader>{email}</Header.Subheader>
    <Header.Subheader>joined {formatDate(createdAt)}</Header.Subheader>

  </Header>
  </Segment>);
}

export default AccountHeader;
