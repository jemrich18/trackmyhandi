from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()


class AuthTest(APITestCase):
    def test_register(self):
        res = self.client.post('/api/accounts/register/', {
            'username': 'newgolfer',
            'email': 'new@test.com',
            'password': 'securepass99',
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['username'], 'newgolfer')
        self.assertNotIn('password', res.data)

    def test_register_duplicate_username(self):
        User.objects.create_user(username='taken', email='taken@test.com', password='pass1234')
        res = self.client.post('/api/accounts/register/', {
            'username': 'taken',
            'email': 'other@test.com',
            'password': 'securepass99',
        })
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_returns_tokens(self):
        User.objects.create_user(username='golfer', email='g@test.com', password='testpass123')
        res = self.client.post('/api/accounts/login/', {
            'username': 'golfer',
            'password': 'testpass123',
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)
        self.assertIn('refresh', res.data)

    def test_login_invalid_credentials(self):
        res = self.client.post('/api/accounts/login/', {
            'username': 'nobody',
            'password': 'wrongpass',
        })
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_requires_auth(self):
        res = self.client.get('/api/accounts/me/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_user(self):
        user = User.objects.create_user(username='golfer', email='g@test.com', password='testpass123')
        self.client.force_authenticate(user=user)
        res = self.client.get('/api/accounts/me/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['username'], 'golfer')
