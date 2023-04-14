<script lang="ts">
  import { Template } from 'svelte-native/components'
  import { data } from '~/data';
  import dayjs from 'dayjs';

  function templateSelector(item, index, items) {
    return 'pot';
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
</script>

<page>
<gridLayout rows="*" backgroundColor='red' height='100%'>
<collectionView class='event-list main-bg' row="1" height="100%" items={ data.results[0].pots } itemTemplateSelector={templateSelector}>
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
                  {#each i.meta as meta}
                    {#if meta.type == 'Ball'}
                    <image src="{ `~/assets/images/balls-lettered/` + meta.value + `.png` }" margin="10" height="50" visibility="{ meta.vaue != '0' ? 'visible' : 'collapsed' }" />
                    {/if}
                  {/each}
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

<style>
  .pot {
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.6) 60%,
      rgba(75, 76, 94, 0.6) 100%
    );
    padding: 5;
    color: white;
  }
</style>