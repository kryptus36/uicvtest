<script lang="ts">
  import { Template } from 'svelte-native/components'
  import { events, promotions } from '~/data';
  import dayjs from 'dayjs';

  let processing = false;
  let list: any;

  function templateSelector(item, index, items) {
    return item.template;
  }

  const humanDate = function (date) {
    const datem = dayjs(date);
    return datem.format('MMMM Do, YYYY');
  };

  export const formatPrize = function (n, p?, x?, s?, c?) {
    // n = number, p = precision (default 0), x = grouping (default thousands),
    // s = separator (default ,), c = character for fraction (default .)
    if (!n) {
      n = 0;
    }

    n = Number(n);

    const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (p > 0 ? '\\D' : '$') + ')';
    const num = n.toFixed(Math.max(0, p));

    return (
      '$' +
      (c ? num.replace('.', c) : num).replace(
        new RegExp(re, 'g'),
        '$&' + (s || ',')
      )
    );
  };

  export const formatPlayoffPrize = function (n) {
    if (!n) {
      return '';
    } else {
      return ' (' + formatPrize(n) + ')';
    }
  };

  async function createList() {
    processing = true;

    const newList: any[] = [];

    newList.push({
      template: 'venue-detail',
      address: 'test',
      locality: 'test',
      region: 'test',
      website: 'test',
      phone: 'test',
    });

    promotions.results.forEach((promotion) => {
      if (!promotion.categories['pots']) return;

      newList.push({
        template: 'promotion',
        title: promotion.title,
        description: promotion.description,
      });
    });

    events.results.forEach((event) => {
      newList.push({
        template: 'event',
        name: event.name,
        date: event.date,
        caller: event.caller,
        other: event.other,
        times: event.times,
      });

      event.pots.forEach((pot) => {
        const balls: any[] = [];
        pot.meta.forEach((meta) => {
          if(meta.type == 'Ball') {
            balls.push(meta.value);
          }
        });
        
        newList.push({
          template: 'pot',
          name: pot.name,
          numbers: pot.inNumbers,
          prize: pot.prize,
          playoffDate: pot.playoffDate,
          playoffEvent: pot.playoffEvent,
          playoffPrize: pot.playoffPrize,
          info: pot.info,
          balls
        });
      });
    });

    list = newList;

    processing = false;
  }
</script>

<page on:navigatedTo={createList}>
<gridLayout rows="*" backgroundColor='red' height='100%'>
<collectionView class='event-list main-bg'  height="100%" items={ list } itemTemplateSelector="{ templateSelector }">
        <Template let:item={i} key="venue-detail">
          <stackLayout class='venue-detail'>
            <!--label text="{address}" />
                  <label text="{ website }" />
                  <label text="{ phone }" /-->
            <label text="For informational purposes only. In case of a discrepancy between this app and pot information posted in the bingo hall the latter shall be deemed correct." textWrap="true" class='disclaimer' />
          </stackLayout>
        </Template>
        <Template let:item={i} key="promotion">
            <stackLayout class='promotion'>
              <label text="{  i.title  }" class='title' textWrap='true' />
              <label text="{  i.description  }" class='description' textWrap='true' />
            </stackLayout>
          </Template>
          <Template let:item={i} key="event">
            <stackLayout class="event">
              <label column="1" class="event-name" textWrap="true">
                <formattedString>
                  <span text="{i.name}" />
                  <span text=" - " />
                  <span text="{ humanDate(i.date) }" />
                </formattedString>
              </label>
              <label text="{ 'Caller: ' + i.caller}" class="event-caller" textWrap="true" />
              <label text="{ i.times }" class="event-times" textWrap="true" />
              <label text="{ i.other }" class="event-other" visibility="{ i.other ? 'visible' : 'collapsed' }" textWrap="true" />
            </stackLayout>
          </Template>
          <Template let:item={i} key="pot">
            <stackLayout class="pot">
              <label text="{i.name}" textWrap="true" />
              <label class="playoff" textWrap="true" visibility="{ i.playoffDate ? 'visible' : 'collapsed' }">
                <formattedString>
                  <span text="Playoff: " />
                  <span text="{ humanDate(i.playoffDate) }" />
                  <span text="{ ' ' + i.playoffEvent }" />
                  <span text="{ formatPlayoffPrize(i.playoffPrize) }" />
                </formattedString>
              </label>
              <label class="info" text="{i.info}" textWrap="true" visibility="{ i.info ? 'visible' : 'collapsed' }" />
              <flexboxLayout flexDirection="row" width="100%" justifyContent="space-between">
                <stackLayout orientation="horizontal">
          
                </stackLayout>
                <label textAlignment="right" verticalAlignment="bottom" textWrap="true">
                  <formattedString>
                    <span text="{i.numbers ? 'in ' + i.numbers + '#s or less ': ''}" />
                    <span text="{formatPrize(i.prize)}" />
                  </formattedString>
                </label>
              </flexboxLayout>
            </stackLayout>
          </Template>
      </collectionView>
</gridLayout>
</page>

<style lang="scss">


.venue-detail {
  font-size: 16;
  padding: 5;
  
}

.event-list {
  color: white;

  .disclaimer {
    font-size: 10;
    font-style: italic;
    padding: 5;
  }

  .promotion {
    background: #e65239;
    color: white;
    text-align: center;
    padding: 10 0 10 0;
  }

  .promotion .title {
    font-size: 30;
    font-weight: 900;
    font-style: italic;
    font-family: Righteous-Regular;
    line-height: 3;
    text-transform: uppercase;
    text-align: center;
  }

  .event {
    background-image: url('~/assets/images/bgdark.png');
    text-align: center;
    padding: 5;
    font-weight: 800;
    color: white;
  }

  .pot {
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.6) 60%,
      rgba(75, 76, 94, 0.6) 100%
    );
    padding: 5;
    color: white;
  }

  .playoff {
    color: yellow;
  }
}

</style>