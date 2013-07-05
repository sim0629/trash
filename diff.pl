#!/usr/bin/perl

use Encode;
use HTTP::Request;
use LWP::UserAgent;
use Mojo::DOM;
use Try::Tiny;

my %ranks;
my $FETCH_CYCLE = 20;
my $privmsg_count = 0;

sub trim {
    my $string = shift;
    $string =~ s/^\s+//;
    $string =~ s/\s+$//;
    return $string;
}

sub fetch {
    my $result = "";
    my $request = HTTP::Request->new(GET => "http://graph.byb.kr");
    my $ua = LWP::UserAgent->new;
    $ua->agent("Mozilla/5.0");
    my $response = $ua->request($request);
    if ($response->is_success) {
        my $string = $response->decoded_content;
        my $dom = Mojo::DOM->new;
        $dom->parse($string);
        my $lis = $dom->find("#ranking .rankElement .data");
        my $index = 0;
        my $draw_count = 0;
        my $prev_point = 0;
        foreach my $li (@$lis) {
            $index++;
            my $nick = $li->at(".nick")->text;
            my $point = $li->at(".point")->text;
            if ($prev_point == $point) {
                $draw_count++;
            }else {
                $draw_count = 0;
            }
            $prev_point = $point;
            my $rank = $index - $draw_count;
            if (exists $ranks{$nick}) {
                if ($ranks{$nick} != $rank) {
                    my $change = $ranks{$nick} - $rank;
                    $result .= "$rank. $nick(";
                    $result .= "+" if($change > 0);
                    $result .= "$change) | ";
                }
            }
            $ranks{$nick} = $rank;
        }
    }
    return $result;
}

sub event_privmsg {
    my ($server, $data, $nick, $address) = @_;
    my ($target, $text) = split(/ :/, $data, 2);
    return if ($target !~ /^#channel$/);
    $privmsg_count++;
    if ($privmsg_count >= $FETCH_CYCLE) {
        $privmsg_count = 0;
        my $result = fetch();
        $server->command("MSG ${target} ${result}") unless ($result eq "");
    }
}

if(caller) {
    require Irssi;
    fetch();
    Irssi::signal_add("event privmsg", "event_privmsg");
}else {
    binmode(STDOUT, ":utf8");
    print fetch();
    #print main(@ARGV[0]);
    print "\n";
}
