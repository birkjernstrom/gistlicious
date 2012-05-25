from redis import StrictRedis

class GistStorage(object):
    SUPER_KEY = 'live'

    def __init__(self, host, port, password):
        self.client = StrictRedis(host=host, port=port, password=password)

    def upvote(self, gist_id):
        return self.client.zincrby(self.SUPER_KEY, gist_id, 1)

    def get_rank(self, gist_id):
        return self.client.zrevrank(self.SUPER_KEY, gist_id)

    def get_points(self, gist_id):
        return self.client.zscore(self.SUPER_KEY, gist_id)

    def get_rank_list(self, offset=0, num=-1):
        return self.client.zrevrange(self.SUPER_KEY, offset, num, withscores=True, score_cast_func=float)

